import type { APIRoute } from 'astro'
import { createClient } from '@libsql/client'
import { getSession } from 'auth-astro/server'

const client = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? '',
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? '',
})

interface Entry {
  date: string
  amount: number
  category: string
  description?: string
}

const isValidDate = (dateString: string): boolean => {
  // Expresión regular para validar formato de fecha yyyy-mm-dd
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false

  // Validar si la fecha es válida en JS (puede ser una fecha inválida como 2022-02-30)
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

const isValidAmount = (amount: any): boolean => {
  // Validar si la cantidad es un número positivo
  if (typeof amount === 'number' && amount >= 0) {
    return true
  }

  // Si no es un número, intentar convertirlo a número con 2 decimales
  const parsedAmount = parseFloat(amount)
  if (!isNaN(parsedAmount) && parsedAmount >= 0) {
    return true
  }

  return false
}


export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const { date, amount, category, description } = body as Entry
  const session = await getSession(request)
  const email = session?.user?.email
  const full_name = session?.user?.name

  if (!email || !full_name) return new Response('Unauthorized', { status: 401 })
  if (!date || !amount || !category || !description) return new Response('Missing required fields', { status: 400 })

  if (!isValidDate(date)) return new Response('Invalid date format', { status: 400 })
  if (!isValidAmount(amount)) return new Response('Invalid amount', { status: 400 })

  const user = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  })

  if (user.rows.length === 0) {
    await client.execute({
      sql: 'INSERT INTO users (email, full_name) VALUES (?, ?)',
      args: [email, full_name]
    })
  }

  await client.execute({
    sql: 'INSERT INTO money_entries (user_email, DATE, amount, category, description) VALUES (?, ?, ?, ?, ?)',
    args: [email, date, amount, category, description]
  })

  return new Response(JSON.stringify({
    message: 'Entry added successfully'
  }), { status: 200 })
}

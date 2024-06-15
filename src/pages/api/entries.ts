import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'
import { isValidDate, isValidAmount } from '@utils/validation'

interface Entry {
  date: string
  amount: number
  category: string
  description?: string
}

export const POST: APIRoute = async ({ request }) => {
  const { session, client } = await getSessionAndClient(request)

  const body = await request.json()
  const { date, amount, category, description } = body as Entry
  const email = session?.user?.email
  const fullName = session?.user?.name

  if (!email || !fullName) return new Response('Unauthorized', { status: 401 })
  if (!date || !amount || !category || !description) {
    return new Response('Missing required fields', { status: 400 })
  }

  if (!isValidDate(date)) return new Response('Invalid date format', { status: 400 })
  if (!isValidAmount(amount)) return new Response('Invalid amount', { status: 400 })

  const user = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  })

  if (user.rows.length === 0) {
    await client.execute({
      sql: 'INSERT INTO users (email, full_name) VALUES (?, ?)',
      args: [email, fullName]
    })
  }

  await client.execute({
    sql: 'INSERT INTO money_entries (user_email, DATE, amount, category, description) VALUES (?, ?, ?, ?, ?)',
    args: [email, date, amount, category, description]
  })

  return new Response(
    JSON.stringify({
      message: 'Entry added successfully'
    }),
    { status: 201 }
  )
}

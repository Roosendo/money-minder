import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'
import { isValidDate, isValidAmount } from '@utils/validation'

interface Saving {
  name: string
  targetAmount: number
  currentAmount: number
  startDate: string
  endDate: string
}

// POST -> /api/savings

export const POST: APIRoute = async ({ request }) => {
  const { session, client } = await getSessionAndClient(request)

  const body = await request.json()
  const { name, targetAmount, currentAmount, startDate, endDate } = body as Saving
  const email = session?.user?.email
  const fullName = session?.user?.name

  if (!email || !fullName) return new Response('Unauthorized', { status: 401 })
  if (!name || !targetAmount || !startDate || !endDate) {
    return new Response('Missing required fields', { status: 400 })
  }

  if (!isValidDate(startDate)) return new Response('Invalid start date format', { status: 400 })
  if (!isValidDate(endDate)) return new Response('Invalid end date format', { status: 400 })
  if (!isValidAmount(targetAmount)) return new Response('Invalid objective amount', { status: 400 })
  if (!isValidAmount(currentAmount)) return new Response('Invalid current amount', { status: 400 })

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
    sql: 'INSERT INTO savings_goals (user_email, name, target_amount, current_amount, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
    args: [email, name, targetAmount, currentAmount, startDate, endDate]
  })

  return new Response(
    JSON.stringify({
      message: 'Saving added successfully'
    }),
    { status: 201 }
  )
}

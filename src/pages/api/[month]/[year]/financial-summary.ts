import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> api/[month]/[year]/financial-summary
// []* replace with the month and year from the user
// JSON -> {"totalEntries":150.09,"totalExits":35.99}

export const GET: APIRoute = async ({ params, request }) => {
  const { session, client } = await getSessionAndClient(request)

  const month = params.month
  const year = params.year
  const email = session?.user?.email

  if (!email) return new Response('Unauthorized', { status: 401 })
  if (!month || !year) return new Response('Month and year are required', { status: 400 })

  const userEntries = await client.execute({
    sql: 'SELECT SUM(amount) AS totalEntries FROM money_entries WHERE user_email = ? AND strftime("%m", date) = ? AND strftime("%Y", date) = ?',
    args: [email, month, year]
  })

  const userExits = await client.execute({
    sql: 'SELECT SUM(amount) AS totalExits FROM money_exits WHERE user_email = ? AND strftime("%m", date) = ? AND strftime("%Y", date) = ?',
    args: [email, month, year]
  })

  if (userEntries.rows.length === 0) {
    return new Response('Entries by category not found', { status: 404 })
  }

  if (userExits.rows.length === 0) {
    return new Response('Exits by category not found', { status: 404 })
  }

  const totalEntries = userEntries?.rows[0]?.totalEntries ?? 0
  const totalExits = userExits?.rows[0]?.totalExits ?? 0

  return new Response(JSON.stringify({ totalEntries, totalExits }), { status: 200 })
}

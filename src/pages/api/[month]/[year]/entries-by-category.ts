import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> api/[month]/[year]/entries-by-category
// []* replace with the month and year from the user
// JSON -> [{ "category":"Ingreso Familiar","total":41.6 }]

export const GET: APIRoute = async ({ params, request }) => {
  const { session, client } = await getSessionAndClient(request)

  const month = params.month
  const year = params.year
  const email = session?.user?.email

  if (!email) return new Response('Unauthorized', { status: 401 })
  if (!month || !year) return new Response('Month and year are required', { status: 400 })

  const user = await client.execute({
    sql: 'SELECT category, SUM(amount) AS total FROM money_entries WHERE user_email = ? AND strftime("%m", date) = ? AND strftime("%Y", date) = ? GROUP BY category',
    args: [email, month, year]
  })

  if (user.rows.length === 0) {
    return new Response('Entries by category not found', { status: 404 })
  }

  return new Response(JSON.stringify(user.rows), { status: 200 })
}

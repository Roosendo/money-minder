import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> api/dashboard/recent-transactions
// JSON -> [{"date":"2024-05-22","category":"Educación","amount":25}]

export const GET: APIRoute = async ({ request }) => {
  const { session, client } = await getSessionAndClient(request)

  const year = new Date().getFullYear().toString()
  const email = session?.user?.email

  if (!email) return new Response('Unauthorized', { status: 401 })

  const user = await client.execute({
    sql: `SELECT
            date,
            category,
            amount
          FROM
            (
              SELECT
                date,
                category,
                amount
              FROM
                money_entries
              WHERE
                user_email = ?
                AND STRFTIME('%Y', date) = ?
              ORDER BY
                entry_id DESC
              LIMIT
                4
            ) AS latest_entries
          UNION ALL
          SELECT
            date,
            category,
            amount
          FROM
            (
              SELECT
                category,
                amount,
                date
              FROM
                money_exits
              WHERE
                user_email = ?
                AND STRFTIME('%Y', date) = ?
              ORDER BY
                exit_id DESC
              LIMIT
                4
            ) AS latest_exits
          ORDER BY
            date DESC
          `,
    args: [email, year, email, year]
  })

  if (user.rows.length === 0) return new Response('No recent transactions found', { status: 404 })

  return new Response(JSON.stringify(user.rows), { status: 200 })
}

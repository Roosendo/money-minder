import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> /api/dashboard/main-categories
// JSON -> [{"category":"Educación","total":25}]

export const GET: APIRoute = async ({ request }) => {
	const { session, client } = await getSessionAndClient(request)

	const year = new Date().getFullYear().toString()
	const email = session?.user?.email

	if (!email) return new Response('Unauthorized', { status: 401 })

	const user = await client.execute({
		sql: `SELECT category, SUM(amount) AS total
          FROM (
              SELECT category, amount, date
              FROM money_entries
              WHERE user_email = ? AND strftime("%Y", date) = ?
              UNION ALL
              SELECT category, amount AS amount, date
              FROM money_exits
              WHERE user_email = ? AND strftime("%Y", date) = ?
          ) AS combined
          GROUP BY category
          `,
		args: [email, year, email, year]
	})

	if (user.rows.length === 0) return new Response('No entries found', { status: 404 })

	return new Response(JSON.stringify(user.rows), { status: 200 })
}

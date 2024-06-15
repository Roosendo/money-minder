import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> api/dashboard/get-cash-flow
// JSON -> [{"month":"01","total_ingresos":150.09,"total_egresos":35.99}]

export const GET: APIRoute = async ({ request }) => {
	const { session, client } = await getSessionAndClient(request)

	const year = new Date().getFullYear().toString()
	const email = session?.user?.email

	if (!email) return new Response('Unauthorized', { status: 401 })

	const user = await client.execute({
		sql: `SELECT
            month,
            SUM(total_ingresos) AS total_ingresos,
            SUM(total_egresos) AS total_egresos
          FROM
            (
              SELECT
                STRFTIME('%m', DATE) AS month,
                SUM(amount) AS total_ingresos,
                0 AS total_egresos
              FROM
                money_entries
              WHERE
                STRFTIME('%Y', DATE) = ?
              AND
                user_email = ?
              GROUP BY
                STRFTIME('%m', DATE)
              UNION ALL
              SELECT
                STRFTIME('%m', DATE) AS month,
                0 AS total_ingresos,
                SUM(amount) AS total_egresos
              FROM
                money_exits
              WHERE
                STRFTIME('%Y', DATE) = ?
              AND
                user_email = ?
              GROUP BY
                STRFTIME('%m', DATE)
            )
          GROUP BY
            month
          ORDER BY
            month`,
		args: [year, email, year, email]
	})

	if (user.rows.length === 0) return new Response('No entries or exits found', { status: 404 })

	return new Response(JSON.stringify(user.rows), { status: 200 })
}

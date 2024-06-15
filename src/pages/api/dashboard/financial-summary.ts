import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> api/dashboard/financial-summary
// JSON -> {"totalEntries":167.09,"totalExits":102.47}

export const GET: APIRoute = async ({ request }) => {
	const { session, client } = await getSessionAndClient(request)

	const year = new Date().getFullYear().toString()
	const email = session?.user?.email

	if (!email) return new Response('Unauthorized', { status: 401 })

	const userEntries = await client.execute({
		sql: 'SELECT SUM(amount) AS totalEntries FROM money_entries WHERE user_email = ? AND strftime("%Y", date) = ?',
		args: [email, year]
	})

	const userExits = await client.execute({
		sql: 'SELECT SUM(amount) AS totalExits FROM money_exits WHERE user_email = ? AND strftime("%Y", date) = ?',
		args: [email, year]
	})

	if (userEntries.rows.length === 0) {
		return new Response('Entries not found', { status: 404 })
	}

	if (userExits.rows.length === 0) {
		return new Response('Exits not found', { status: 404 })
	}

	const totalEntries = userEntries?.rows[0]?.totalEntries ?? null
	const totalExits = userExits?.rows[0]?.totalExits ?? null

	return new Response(JSON.stringify({ totalEntries, totalExits }), { status: 200 })
}

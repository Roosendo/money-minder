import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> api/get-savings
// JSON -> [{"id":3,"name":"PlayStation 5","target_amount":849,"current_amount":0}]

export const GET: APIRoute = async ({ request }) => {
	const { session, client } = await getSessionAndClient(request)
	const email = session?.user?.email

	if (!email) return new Response('Unauthorized', { status: 401 })

	const user = await client.execute({
		sql: 'SELECT id, name, target_amount, current_amount, end_date FROM savings_goals WHERE user_email = ?',
		args: [email]
	})

	if (user.rows.length === 0) return new Response('Exits not found', { status: 404 })

	return new Response(JSON.stringify(user.rows), { status: 200 })
}

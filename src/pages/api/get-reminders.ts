import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> api/get-reminders
// JSON -> [{"id":1,"title":"Cuota","description":"A PAGAR","reminder_date":"2024-05-31T08:53","is_completed":0}]

export const GET: APIRoute = async ({ request }) => {
	const { session, client } = await getSessionAndClient(request)
	const email = session?.user?.email

	if (!email) return new Response('Unauthorized', { status: 401 })

	const user = await client.execute({
		sql: 'SELECT id, title, description, reminder_date FROM reminders WHERE user_email = ?',
		args: [email]
	})

	if (user.rows.length === 0) return new Response('Reminders not found', { status: 404 })

	return new Response(JSON.stringify(user.rows), { status: 200 })
}

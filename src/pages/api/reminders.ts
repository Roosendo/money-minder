import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'
import { isValidISODateTime } from '@utils/validation'

interface Reminder {
	title: string
	description: string
	reminderDate: string
}

// POST -> /api/reminders

export const POST: APIRoute = async ({ request }) => {
	const { session, client } = await getSessionAndClient(request)

	const body = await request.json()
	const { title, description, reminderDate } = body as Reminder
	const email = session?.user?.email
	const full_name = session?.user?.name

	if (!email || !full_name) return new Response('Unauthorized', { status: 401 })
	if (!title || !reminderDate) return new Response('Missing required fields', { status: 400 })

	if (!isValidISODateTime(reminderDate)) return new Response('Invalid date format', { status: 400 })

	const user = await client.execute({
		sql: 'SELECT * FROM users WHERE email = ?',
		args: [email]
	})

	if (user.rows.length === 0) {
		await client.execute({
			sql: 'INSERT INTO users (email, full_name) VALUES (?, ?)',
			args: [email, full_name]
		})
	}

	await client.execute({
		sql: 'INSERT INTO reminders (user_email, title, description, reminder_date) VALUES (?, ?, ?, ?)',
		args: [email, title, description, reminderDate]
	})

	return new Response(
		JSON.stringify({
			message: 'Reminder added successfully'
		}),
		{ status: 201 }
	)
}

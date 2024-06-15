import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// DELETE -> /api/[reminderId]/delete-reminder
// [savingId] -> replace with the ID of the reminder

export const DELETE: APIRoute = async ({ params, request }) => {
	const { session, client } = await getSessionAndClient(request)

	const reminderId = params.reminderId
	const email = session?.user?.email

	if (!email) return new Response('Unauthorized', { status: 401 })
	if (!reminderId) return new Response('Reminder ID is required', { status: 400 })

	await client.execute({
		sql: 'DELETE FROM reminders WHERE user_email = ? AND id = ?',
		args: [email, reminderId]
	})

	return new Response(
		JSON.stringify({
			message: 'Reminder deleted successfully'
		}),
		{ status: 200 }
	)
}

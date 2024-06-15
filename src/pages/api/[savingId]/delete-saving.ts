import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// DELETE -> /api/[savingId]/delete-saving
// [savingId] -> replace with the ID of the saving

export const DELETE: APIRoute = async ({ params, request }) => {
	const { session, client } = await getSessionAndClient(request)

	const savingId = params.savingId
	const email = session?.user?.email

	if (!email) return new Response('Unauthorized', { status: 401 })
	if (!savingId) return new Response('Saving ID is required', { status: 400 })

	await client.execute({
		sql: 'DELETE FROM savings_goals WHERE user_email = ? AND id = ?',
		args: [email, savingId]
	})

	return new Response(
		JSON.stringify({
			message: 'Saving updated successfully'
		}),
		{ status: 200 }
	)
}

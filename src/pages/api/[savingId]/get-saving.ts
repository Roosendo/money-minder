import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'

// GET -> /api/[savingId]/get-saving
// [savingId] -> replace with the ID of the saving
// JSON -> {"name":"PlayStation 5","target_amount":849,"current_amount":0,"end_date":"2024-05-26"}

export const GET: APIRoute = async ({ params, request }) => {
  const { session, client } = await getSessionAndClient(request)

  const savingId = params.savingId
  const email = session?.user?.email

  if (!email) return new Response('Unauthorized', { status: 401 })
  if (!savingId) return new Response('Saving ID is required', { status: 400 })

  const saving = await client.execute({
    sql: 'SELECT name, target_amount, current_amount, end_date FROM savings_goals WHERE user_email = ? AND id = ?',
    args: [email, savingId]
  })

  if (saving.rows.length === 0) return new Response('Saving not found', { status: 404 })

  return new Response(JSON.stringify(saving.rows[0]), { status: 200 })
}
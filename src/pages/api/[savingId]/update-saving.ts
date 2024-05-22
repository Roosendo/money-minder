import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'
import { isValidDate, isValidAmount } from '@utils/validation'

interface SavingPatch {
  newSavingName: string
  newTarget: number
  newCurrentAmount: number
  newEndDate: string
}

// PATCH -> /api/[savingId]/update-saving
// [savingId] -> replace with the ID of the saving

export const PATCH: APIRoute = async ({ params, request }) => {
  const { session, client } = await getSessionAndClient(request)

  const savingId = params.savingId
  const email = session?.user?.email
  const body = await request.json()
  const { newSavingName, newTarget, newCurrentAmount, newEndDate } = body as SavingPatch

  if (!email) return new Response('Unauthorized', { status: 401 })
  if (!savingId) return new Response('Saving ID is required', { status: 400 })
  if (!newSavingName || !newTarget || !newCurrentAmount || !newEndDate) return new Response('Missing required fields', { status: 400 })
  if (!isValidDate(newEndDate)) return new Response('Invalid end date format', { status: 400 })
  if (!isValidAmount(newTarget)) return new Response('Invalid objective amount', { status: 400 })

  await client.execute({
    sql: 'UPDATE savings_goals SET name = ?, target_amount = ?, current_amount = ?, end_date = ? WHERE user_email = ? AND id = ?',
    args: [newSavingName, newTarget, newCurrentAmount, newEndDate, email, savingId]
  })

  return new Response(JSON.stringify({
    message: 'Saving updated successfully'
  }), { status: 200 })
}
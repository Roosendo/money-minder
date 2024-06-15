import type { APIRoute } from 'astro'
import { getSessionAndClient } from '@config/utils'
import { isValidISODateTime } from '@utils/validation'

interface ReminderPatch {
  newTitle: string
  newDescription: number
  newDate: string
}

// PATCH -> /api/[reminderId]/update-reminder
// [reminderId] -> replace with the ID of the reminder

export const PATCH: APIRoute = async ({ params, request }) => {
  const { session, client } = await getSessionAndClient(request)

  const reminderId = params.reminderId
  const email = session?.user?.email
  const body = await request.json()
  const { newTitle, newDescription, newDate } = body as ReminderPatch

  if (!email) return new Response('Unauthorized', { status: 401 })
  if (!reminderId) return new Response('Reminder ID is required', { status: 400 })
  if (!newTitle || !newDate) return new Response('Missing required fields', { status: 400 })
  if (!isValidISODateTime(newDate)) return new Response('Invalid date format', { status: 400 })

  await client.execute({
    sql: 'UPDATE reminders SET title = ?, description = ?, reminder_date = ? WHERE user_email = ? AND id = ?',
    args: [newTitle, newDescription, newDate, email, reminderId]
  })

  return new Response(
    JSON.stringify({
      message: 'Reminder updated successfully'
    }),
    { status: 200 }
  )
}

import type { APIRoute } from 'astro'
import { createClient } from '@libsql/client'
import { getSession } from 'auth-astro/server'

const client = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? '',
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? '',
})

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request)
  const email = session?.user?.email

  if (!email) return new Response('Unauthorized', { status: 401 })

  const user = await client.execute({
    sql: 'SELECT amount, description, category, DATE FROM money_entries WHERE user_email = ? ORDER BY entry_id DESC LIMIT 15',
    args: [email]
  })

  if (user.rows.length === 0) {
    return new Response('Entries not found', { status: 404 })
  }

  return new Response(JSON.stringify(user.rows), { status: 200 })
}

import type { APIRoute } from 'astro'
import { createClient } from '@libsql/client'
import bcrypt from 'bcrypt'

const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

const client = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? '',
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? '',
})

interface LoginBody {
  email: string
  userPassword: string
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  let { email, userPassword } = body as LoginBody

  if (!email || !userPassword) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  const user = await client.execute({
    sql: 'SELECT password FROM users WHERE email = ?',
    args: [email]
  })

  if (user.rows.length === 0) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
  }

  const passwordHashed = user.rows[0]?.password as string

  const isPasswordCorrect = await comparePassword(userPassword, passwordHashed)

  if (!isPasswordCorrect) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 })
  } else {
    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 })
  }
}
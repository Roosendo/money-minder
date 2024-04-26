import type { APIRoute } from 'astro'
import { createClient } from '@libsql/client'
import { v4 as uuid } from 'uuid'

const client = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
})

interface SignUpBody {
  name: string
  lastname: string
  email: string
  password: string
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const { name, lastname, email, password } = body as SignUpBody

  if (!name || !lastname || !email || !password) {
    return new Response(JSON.stringify({
      error: 'Missing required fields'
    }), { status: 400 })
  }

  const user = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  })

  if (user.rows.length > 0) {
    return new Response(JSON.stringify({
      error: 'User already exists'
    }), { status: 409 })
  }

  const newUserId = uuid()

  await client.execute({
    sql: 'INSERT INTO users (id, name, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
    args: [newUserId, name, lastname, email, password]
  })

  return new Response(JSON.stringify({
    message: 'User created'
  }), { status: 201 })
}

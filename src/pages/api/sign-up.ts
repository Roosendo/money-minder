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

export const Post: APIRoute = async ({ request }) => {
  const { name, lastname, email, password }: SignUpBody = await request.json()

  if (!name || !lastname || !email || !password) {
    return new Response('Missing required fields', { status: 400 })
  }

  const newUserId = uuid()

  await client.execute({
    sql: 'INSERT INTO users (id, name, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
    args: [newUserId, name, lastname, email, password]
  })

  return new Response('User created', { status: 201 })
}
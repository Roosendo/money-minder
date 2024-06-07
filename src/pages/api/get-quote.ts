import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    const response = await fetch('https://frasedeldia.azurewebsites.net/api/phrase', requestOptions)
    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response('Error', { status: 500 })
  }
}

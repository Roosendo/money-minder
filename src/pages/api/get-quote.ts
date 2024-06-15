import type { APIRoute } from 'astro'
import phrases from '@src/phrases.json'

export const GET: APIRoute = async () => {
	try {
		const today = new Date()
		const index = today.getDate() % phrases.length
		const phrase = phrases[index]

		return new Response(JSON.stringify(phrase), { status: 200 })
	} catch (error) {
		return new Response('Error', { status: 500 })
	}
}

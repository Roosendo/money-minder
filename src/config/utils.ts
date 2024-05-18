import { getSession } from 'auth-astro/server'
import { client } from '@config/tursoClient'

export const getSessionAndClient = async (request: Request) => {
  const session = await getSession(request)
  return { session, client }
}

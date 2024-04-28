interface LoginUser {
  email: string
  userPassword: string
}

export const loginUser = async ({ email, userPassword }: LoginUser): Promise<boolean | number> => {
  const body = { email, userPassword }
  const apiURL = '/api/login'

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }

  try {
    const response = await fetch(apiURL, requestOptions)

    if (response.status === 400 || response.status === 404 || response.status === 401) {
      return response.status
    }

    return true
  } catch (error) {
    return false
  }
}
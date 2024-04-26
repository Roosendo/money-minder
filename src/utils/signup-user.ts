interface SignUpUser {
  name: string
  lastname: string
  email: string
  password: string
}

export const signUpUser = async ({ name, lastname, email, password }: SignUpUser): Promise<boolean | number> => {
  const body = { name, lastname, email, password }
  const apiURL = '/api/sign-up'

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }

  try {
    const response = await fetch(apiURL, requestOptions)

    if (response.status === 400 || response.status === 409) {
      return response.status
    }

    return true
  } catch (error) {
    return false
  }
}

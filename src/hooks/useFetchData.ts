import { useState, useEffect } from  'react'

type FetchState<T> = {
  data: T | null
  error: Error | null
  loading: boolean
}

export const useFetchData = <T>(url: string): FetchState<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!response.ok) throw new Error('Failed to fetch data')
        const result: T = await response.json()
        setData(result)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [url])

  return { data, error, loading }
}

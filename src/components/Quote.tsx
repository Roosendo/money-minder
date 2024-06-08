import { useEffect, useState } from 'react'

interface PhraseData {
  phrase: string
  author: string
}

export default function Quote() {
  const [result, setResult] = useState<PhraseData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-quote', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const data: PhraseData = await response.json()
        setResult(data)
      } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching data:', errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return result ? (
    <div className="flex items-center justify-center p-4">
      <div className="bg-gray-200 dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg">
        {loading && <p className="text-lg text-gray-700 dark:text-gray-200">Cargando...</p>}
        {error && <p className="text-lg text-rose-500">{error}</p>}
        <p className="text-2xl text-gray-900 dark:text-gray-200 mb-4">
          &ldquo;{result.phrase}&rdquo;
        </p>
        <p className="text-right text-lg font-semibold text-gray-700 dark:text-gray-100">
          &mdash; {result.author}
        </p>
      </div>
    </div>
  ) : null
}

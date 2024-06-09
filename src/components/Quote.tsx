import { useFetchData } from '@hooks/useFetchData'

interface PhraseData {
  phrase: string
  author: string
}

// for english quotes use 'https://api.quotable.io/random'

export default function Quote() {
  const { data: result, error, loading } = useFetchData<PhraseData>('/api/get-quote')

  if (error) return null

  return result && (
    <div className="flex items-center justify-center p-4">
      <div className="bg-gray-200 dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg">
        {loading && <p className="text-lg text-gray-700 dark:text-gray-200">Cargando...</p>}
        <p className="text-2xl text-gray-900 dark:text-gray-200 mb-4">
          &ldquo;{result.phrase}&rdquo;
        </p>
        <p className="text-right text-lg font-semibold text-gray-700 dark:text-gray-100">
          &mdash; {result.author}
        </p>
      </div>
    </div>
  )
}

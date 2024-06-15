import { Suspense } from 'react'
import { useFetchData } from '@hooks/useFetchData'
import LoadingSpinner from '@components/LoadingSpinner.tsx'

interface PhraseData {
	phrase: string
	movie: string
	character: string
}

export default function Quote() {
	const { data: result, error } = useFetchData<PhraseData>('/api/get-quote')

	if (error) return null
	if (!result) <LoadingSpinner />

	return (
		result && (
			<Suspense fallback={<LoadingSpinner />}>
				<div className='flex items-center justify-center p-4'>
					<div className='max-w-lg rounded-lg bg-gray-200 p-6 shadow-lg dark:bg-gray-900'>
						<p className='mb-4 text-2xl text-gray-900 dark:text-gray-200'>
							&ldquo;{result.phrase}&rdquo;
						</p>
						<p className='text-right text-lg font-semibold text-gray-700 dark:text-gray-100'>
							&mdash; {result.character} en {result.movie}
						</p>
					</div>
				</div>
			</Suspense>
		)
	)
}

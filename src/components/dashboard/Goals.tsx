import { Suspense } from 'react'
import LoadingSpinner from '@components/LoadingSpinner.tsx'
import { useFetchData } from '@hooks/useFetchData'
import type { Saving } from '@src/types.d.ts'
import { createSavingGoalElement } from '@utils/ui'

function Goals ({ email }: { email: string | undefined | null }) {
  const { data: dataGoals, error } = useFetchData<Saving[]>(
    `/api/savings/get-savings?email=${email}`
  )

  if (error) return null
  if (!dataGoals) return <LoadingSpinner />

  if (dataGoals && dataGoals.length === 0) return null

  return (
    dataGoals && (
      <Suspense fallback={<LoadingSpinner />}>
        <div className='rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-900'>
          <h2 className='mb-4 text-lg font-semibold'>Progreso hacia Objetivos</h2>
          <div id='goals' className='space-y-4'>
            {dataGoals.map((goal) => {
              const goalElement = createSavingGoalElement(goal, false)
              return (
                <div key={goal.id} dangerouslySetInnerHTML={{ __html: goalElement.outerHTML }} />
              )
            })}
          </div>
        </div>
      </Suspense>
    )
  )
}

export default Goals

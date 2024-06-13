import { Suspense } from 'react'
import LoadingSpinner from '@components/LoadingSpinner.tsx'
import { useFetchData } from '@hooks/useFetchData'
import type { Saving } from '@src/types.d.ts'
import { createSavingGoalElement } from '@utils/ui'

function GoalsComponent () {
  const { data: dataGoals } = useFetchData<Saving[]>('/api/get-savings')

  return dataGoals && (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Progreso hacia Objetivos</h2>
      <div id="goals" className="space-y-4">
        {dataGoals.map((goal) => {
          const goalElement = createSavingGoalElement(goal, false)
          return <div key={goal.id} dangerouslySetInnerHTML={{ __html: goalElement.outerHTML }} />
        })}
      </div>
    </div>
  )
}

export default function Goals () {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GoalsComponent />
    </Suspense>
  )
}

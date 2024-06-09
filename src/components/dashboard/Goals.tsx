import { useFetchData } from '@hooks/useFetchData'
import type { Saving } from '@src/types.d.ts'
import { createSavingGoalElement } from '@utils/ui'

export default function Goals () {
  const { data: dataGoals, error, loading } = useFetchData<Saving[]>('/api/get-savings')

  if (loading) return <p>Cargando...</p>
  if (error) return null

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

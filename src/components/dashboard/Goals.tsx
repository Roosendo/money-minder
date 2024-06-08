import { useState, useEffect } from 'react'
import { type Saving, fetchDataSavings } from '@utils/api'
import { createSavingGoalElement } from '@utils/ui'

export default function Goals () {
  const [dataGoals, setDataGoals] = useState<Saving[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataSavings()
        if (data.length === 0) return
        setDataGoals(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return dataGoals ? (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Progreso hacia Objetivos</h2>
      <div id="goals" className="space-y-4">
        {dataGoals.map((goal) => {
          const goalElement = createSavingGoalElement(goal, false)
          return <div key={goal.id} dangerouslySetInnerHTML={{ __html: goalElement.outerHTML }} />
        })}
      </div>
    </div>
  ) : null
}

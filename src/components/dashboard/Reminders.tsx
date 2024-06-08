import { useState, useEffect } from 'react'
import { type Reminder, fetchDataReminders} from '@utils/api'
import { createReminderElement } from '@utils/ui'

export default function Reminders () {
  const [dataReminders, setDataReminders] = useState<Reminder[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataReminders()
        setDataReminders(data)
      } catch (error) {
        if (error instanceof Response && error.status === 404) {
          setDataReminders(null)
        } else {
          setError('Error fetching data')
          console.error('Error fetching data:', error)
        }
      }
    }
    fetchData()
  }, [])

  return dataReminders ? (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Recordatorios</h2>
      <div id="reminders" className="space-y-4">
        {error && <p className="text-rose-500">{error}</p>}
        {dataReminders.map((reminder) => {
          const reminderElement = createReminderElement(reminder, false)
          return <div key={reminder.id} dangerouslySetInnerHTML={{ __html: reminderElement.outerHTML }} />
        })}
      </div>
    </div>
  ) : null
}

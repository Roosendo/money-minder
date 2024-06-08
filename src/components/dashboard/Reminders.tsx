import { useState, useEffect } from 'react'
import { type Reminder, fetchDataReminders} from '@utils/api'
import { createReminderElement } from '@utils/ui'

export default function Reminders () {
  const [dataReminders, setDataReminders] = useState<Reminder[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataReminders()
        if (data.length === 0) return
        setDataReminders(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return dataReminders ? (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Recordatorios</h2>
      <div id="reminders" className="space-y-4">
        {dataReminders.map((reminder) => {
          const reminderElement = createReminderElement(reminder, false)
          return <div key={reminder.id} dangerouslySetInnerHTML={{ __html: reminderElement.outerHTML }} />
        })}
      </div>
    </div>
  ) : null
}

import { useFetchData } from '@hooks/useFetchData'
import type { Reminder} from '@src/types.d.ts'
import { createReminderElement } from '@utils/ui'

export default function Reminders () {
  const { data: dataReminders, error, loading } = useFetchData<Reminder[]>('/api/get-reminders')

  if (loading) return <p>Cargando...</p>
  if (error) return null

  return dataReminders && (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Recordatorios</h2>
      <div id="reminders" className="space-y-4">
        {dataReminders.map((reminder) => {
          const reminderElement = createReminderElement(reminder, false)
          return <div key={reminder.id} dangerouslySetInnerHTML={{ __html: reminderElement.outerHTML }} />
        })}
      </div>
    </div>
  )
}

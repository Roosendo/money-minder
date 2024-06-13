import { Suspense } from 'react'
import LoadingSpinner from '@components/LoadingSpinner.tsx'
import { useFetchData } from '@hooks/useFetchData'
import type { Reminder} from '@src/types.d.ts'
import { createReminderElement } from '@utils/ui'

function RemindersComponent () {
  const { data: dataReminders } = useFetchData<Reminder[]>('/api/get-reminders')

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

export default function Reminders () {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RemindersComponent />
    </Suspense>
  )
}

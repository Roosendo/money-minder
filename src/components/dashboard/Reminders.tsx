import LoadingSpinner from '@components/LoadingSpinner.tsx'
import { useFetchData } from '@hooks/useFetchData'
import type { Reminder } from '@src/types.d.ts'
import { createReminderElement } from '@utils/ui'

const Reminders = ({ email }: { email: string | undefined | null }) => {
  const { data: dataReminders, error } = useFetchData<Reminder[]>(
    `/api/reminders/get-reminders?email=${email}`
  )

  if (error) return null
  if (!dataReminders) return <LoadingSpinner />

  if (dataReminders && dataReminders.length === 0) return null

  return (
    dataReminders && (
      <div className='rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-900'>
        <h2 className='mb-4 text-lg font-semibold'>Recordatorios</h2>
        <div id='reminders' className='space-y-4'>
          {dataReminders.map((reminder) => {
            const reminderElement = createReminderElement(reminder, false)
            return (
              <div
                key={reminder.id}
                dangerouslySetInnerHTML={{ __html: reminderElement.outerHTML }}
              />
            )
          })}
        </div>
      </div>
    )
  )
}

export default Reminders

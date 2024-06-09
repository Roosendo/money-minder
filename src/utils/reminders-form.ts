import { $ } from '@lib/dom-selector'
import { showAndHideAlert } from '@utils/alerts'
import { fetchDataReminders, updateReminder, deleteReminder } from '@utils/api'
import type { Reminder } from '@src/types.d.ts'
import { createReminderElement, createEditReminderModal, openEditModal, createDeleteReminderModal, openDeleteModal } from '@utils/ui'

export const handleFormSubmit = async (
  e: SubmitEvent,
  $reminderForm: HTMLFormElement,
  $alertMessage: HTMLDivElement,
  $alertWarning: HTMLDivElement,
  $divElement: HTMLDivElement
) => {
  e.preventDefault()

  const title = ($('#reminder-title') as HTMLInputElement).value
  const description = ($('#reminder-description') as HTMLInputElement).value
  const reminderDate = ($('#reminder-date') as HTMLInputElement).value

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, reminderDate })
  }

  const response = await fetch('/api/reminders', requestOptions)

  if (response.ok) {
    showAndHideAlert($alertMessage)
    const data = await fetchDataReminders()
    renderDataReminders(data, $divElement)
    $reminderForm.reset()
  } else {
    showAndHideAlert($alertWarning)
  }
}

export const init = async ($divElement: HTMLDivElement) => {
  const data = await fetchDataReminders()
  renderDataReminders(data, $divElement)
}

const renderDataReminders = (data: Reminder[], $divElement: HTMLDivElement) => {
  $divElement.innerHTML = ''
  data.forEach((reminder) => {
    const reminderElement = createReminderElement(reminder)
    $divElement.appendChild(reminderElement)
    const modal = createEditReminderModal(reminder)
    const deleteModal = createDeleteReminderModal(reminder)
    document.body.appendChild(modal)
    document.body.appendChild(deleteModal)

    const $deleteButton = reminderElement.querySelector(`#deleteButton-${reminder.id}`)
    const $editButton = reminderElement.querySelector(`#editButton-${reminder.id}`)
    const $editModal = modal.querySelector(`#edit-modal-${reminder.id}`)
    const $deleteModal = deleteModal.querySelector(`#delete-modal-${reminder.id}`)
    $deleteButton?.addEventListener('click', () => openDeleteModal(reminder))
    $editButton?.addEventListener('click', () => openEditModal(reminder))
    $editModal?.addEventListener('submit', (e) => handleEditFormSubmit(e, reminder.id, $divElement))
    $deleteModal?.addEventListener('submit', (e) => handleDeleteFormSubmit(e, reminder.id, $divElement))
  })
}

const handleEditFormSubmit = async (e: Event, reminderId: number, $divElement: HTMLDivElement) => {
  e.preventDefault()

  const newTitle = ($(`#edit-title-${reminderId}`) as HTMLInputElement).value
  const newDescription = ($(`#edit-description-${reminderId}`) as HTMLInputElement).value
  const newDate = ($(`#edit-reminder-date-${reminderId}`) as HTMLInputElement).value

  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newTitle, newDescription, newDate })
  }

  const response = await updateReminder(reminderId, requestOptions)

  if (response.ok) {
    const data = await fetchDataReminders()
    renderDataReminders(data, $divElement)
    $(`#edit-modal-${reminderId}`)?.classList.replace('flex', 'hidden')
  } else {
    const $alertWarning = $('#alert-error') as HTMLDivElement
    showAndHideAlert($alertWarning)
  }
}

const handleDeleteFormSubmit = async (e: Event, reminderId: number, $divElement: HTMLDivElement) => {
  e.preventDefault()

  const requestOptions = {
    method: 'DELETE'
  }

  const response = await deleteReminder(reminderId, requestOptions)

  if (response.ok) {
    $(`#delete-modal-${reminderId}`)?.classList.replace('flex', 'hidden')
    const data = await fetchDataReminders()
    renderDataReminders(data, $divElement)
  } else {
    const $alertWarning = $('#alert-error') as HTMLDivElement
    showAndHideAlert($alertWarning)
  }
}

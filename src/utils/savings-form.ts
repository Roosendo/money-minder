import { $ } from '@lib/dom-selector'
import { showAndHideAlert } from '@utils/alerts'
import { fetchDataSavings, updateSaving, deleteSaving } from '@utils/api'
import type { Saving } from '@src/types.d.ts'
import {
  createSavingGoalElement,
  createEditModal,
  openEditModal,
  createDeleteModal,
  openDeleteModal
} from '@utils/ui'

export const handleFormSubmit = async (
  e: SubmitEvent,
  $savingForm: HTMLFormElement,
  $alertMessage: HTMLDivElement,
  $alertWarning: HTMLDivElement,
  $divElement: HTMLDivElement
) => {
  e.preventDefault()

  const name = ($('#goal-name') as HTMLInputElement).value
  const targetAmount = ($('#target-amount') as HTMLInputElement).value
  let currentAmount: string | number = ($('#current-amount') as HTMLInputElement).value
  const startDate = ($('#start-date') as HTMLInputElement).value
  const endDate = ($('#end-date') as HTMLInputElement).value

  if (!currentAmount) currentAmount = 0

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, targetAmount, currentAmount, startDate, endDate })
  }

  const response = await fetch('/api/savings', requestOptions)

  if (response.ok) {
    showAndHideAlert($alertMessage)
    const data = await fetchDataSavings()
    renderDataSavings(data, $divElement)
    $savingForm.reset()
  } else {
    showAndHideAlert($alertWarning)
  }
}

export const init = async ($divElement: HTMLDivElement) => {
  const data = await fetchDataSavings()
  renderDataSavings(data, $divElement)
}

const renderDataSavings = (data: Saving[], $divElement: HTMLDivElement) => {
  $divElement.innerHTML = ''
  data.forEach((saving) => {
    const savingGoal = createSavingGoalElement(saving)
    $divElement.appendChild(savingGoal)
    const modal = createEditModal(saving)
    const deleteModal = createDeleteModal(saving)
    document.body.appendChild(modal)
    document.body.appendChild(deleteModal)

    const $deleteButton = savingGoal.querySelector(`#deleteButton-${saving.id}`)
    const $editButton = savingGoal.querySelector(`#editButton-${saving.id}`)
    const $editModal = modal.querySelector(`#edit-modal-${saving.id}`)
    const $deleteModal = deleteModal.querySelector(`#delete-modal-${saving.id}`)
    $editButton?.addEventListener('click', () => openEditModal(saving))
    $deleteButton?.addEventListener('click', () => openDeleteModal(saving))
    $editModal?.addEventListener('submit', (e: Event) =>
      handleEditFormSubmit(e, saving.id, $divElement)
    )
    $deleteModal?.addEventListener('submit', (e: Event) =>
      handleDeleteFormSubmit(e, saving.id, $divElement)
    )
  })
}

const handleEditFormSubmit = async (e: Event, id: number, $divElement: HTMLDivElement) => {
  e.preventDefault()

  const newSavingName = ($(`#edit-goal-name-${id}`) as HTMLInputElement).value
  const newTarget = ($(`#edit-target-amount-${id}`) as HTMLInputElement).value
  const newCurrentAmount = ($(`#edit-current-amount-${id}`) as HTMLInputElement).value
  const newEndDate = ($(`#edit-end-date-${id}`) as HTMLInputElement).value

  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newSavingName, newTarget, newCurrentAmount, newEndDate })
  }

  const response = await updateSaving(id, requestOptions)

  if (response.ok) {
    const data = await fetchDataSavings()
    renderDataSavings(data, $divElement)
    $(`#edit-modal-${id}`)?.classList.replace('flex', 'hidden')
  } else {
    const $alertWarning = $('#alert-error') as HTMLDivElement
    showAndHideAlert($alertWarning)
  }
}

const handleDeleteFormSubmit = async (e: Event, id: number, $divElement: HTMLDivElement) => {
  e.preventDefault()

  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  }

  const response = await deleteSaving(id, requestOptions)

  if (response.ok) {
    $(`#delete-modal-${id}`)?.classList.replace('flex', 'hidden')
    const data = await fetchDataSavings()
    renderDataSavings(data, $divElement)
  } else {
    const $alertWarning = $('#alert-error') as HTMLDivElement
    showAndHideAlert($alertWarning)
  }
}

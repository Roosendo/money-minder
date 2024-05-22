import type { Transaction, Summary, Saving } from '@utils/api'
import { $ } from '@lib/dom-selector'
import { createGraphic } from '@utils/create-graph'

export const updateMonthText = (monthText: HTMLHeadingElement, date: Date) => {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const year = date.getFullYear()
  const month = monthNames[date.getMonth()]

  if (monthText) monthText.textContent = `Mostrando datos de ${month} de ${year}`
}

export const updateGraphics = (
  dataEntries: Transaction[],
  dataExits: Transaction[],
  $canvaIngreso: HTMLCanvasElement,
  $canvaEgreso: HTMLCanvasElement
) => {
  if (dataEntries.length === 0) {
    createGraphic($canvaIngreso, ['Sin datos'], [0], 'Ingresos')
  } else {
    const categorysEntries = dataEntries.map(entry => entry.category)
    const totalsEntries = dataEntries.map(entry => entry.total)
    createGraphic($canvaIngreso, categorysEntries, totalsEntries, 'Ingresos')
  }

  if (dataExits.length === 0) {
    createGraphic($canvaEgreso, ['Sin datos'], [0], 'Egresos')
  } else {
    const categorysExits = dataExits.map(exit => exit.category)
    const totalsExits = dataExits.map(exit => exit.total)
    createGraphic($canvaEgreso, categorysExits, totalsExits, 'Gastos')
  }
}

export const updateSummary = (
  dataSummary: Summary,
  $totalIngresos: HTMLSpanElement,
  $totalEgresos: HTMLSpanElement,
  $difference: HTMLSpanElement
) => {
  $totalIngresos.textContent = `$${dataSummary.totalEntries.toString()}`
  $totalEgresos.textContent = `$${dataSummary.totalExits.toString()}`

  const difference = dataSummary.totalEntries - dataSummary.totalExits
  $difference.textContent = `$${difference.toString()}`

  if (difference < 0) {
    $difference.classList.remove('text-teal-600')
    $difference.classList.add('text-rose-600')
  } else {
    $difference.classList.remove('text-rose-600')
    $difference.classList.add('text-teal-600')
  }
}

/* functions for Savings */

export const createSavingGoalElement = (saving: Saving): HTMLDivElement => {
  const savingGoal = document.createElement('div')
  const percentage = (saving.current_amount / saving.target_amount) * 100
  savingGoal.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-md relative">
      <h3 class="text-lg font-bold mt-2 text-gray-700">Nombre del objetivo: ${saving.name}</h3>
      <p class="text-gray-600">Monto objetivo: $${saving.target_amount}</p>
      <p class="text-gray-600">Monto actual: $${saving.current_amount}</p>
      <div class="w-full bg-gray-200 rounded-full h-2 mt-2 mb-4">
        <div class="bg-teal-500 h-2 rounded-full" style="width: ${percentage}%"></div>
      </div>
      <button id="editButton-${saving.id}" class="absolute top-3 right-4 text-teal-500 hover:text-teal-700">Editar</button>
      <button id="deleteButton-${saving.id}" class="absolute top-3 right-20 text-rose-500 hover:text-rose-700">Eliminar</button>
    </div>
  `
  return savingGoal
}

export const createEditModal = (saving: Saving): HTMLDivElement => {
  const modal = document.createElement('div')
  modal.innerHTML = `
    <form id="edit-modal-${saving.id}" class="fixed inset-0 animate-zoom-in items-center justify-center bg-gray-900 bg-opacity-50 hidden">
      <div class="bg-white text-black p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 class="text-xl font-bold mb-4 text-center">Editar Objetivo de Ahorro</h2>
        <div class="mb-4">
          <label for="edit-goal-name-${saving.id}" id="label-edit-goal-name-${saving.id}" class="block font-semibold mb-2">Nombre actual</label>
          <input type="text" id="edit-goal-name-${saving.id}" class="block p-2.5 w-full z-20 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="PlayStation 5" required value="${saving.name}" />
        </div>
        <div class="mb-4">
          <label for="edit-target-amount-${saving.id}" class="block text-gray-700 font-semibold mb-2">Monto objetivo actual</label>
          <input type="number" id="edit-target-amount-${saving.id}" class="block p-2.5 w-full z-20 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" value="${saving.target_amount}" step="0.01">
        </div>
        <div class="mb-4">
          <label for="edit-current-amount-${saving.id}" class="block text-gray-700 font-semibold mb-2">Monto actual</label>
          <input type="number" id="edit-current-amount-${saving.id}" class="block p-2.5 w-full z-20 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" value="${saving.current_amount}" step="0.01">
        </div>
        <div class="mb-4">
          <label for="edit-end-date-${saving.id}" class="block text-gray-700 font-semibold mb-2">Fecha de fin</label>
          <input type="date" id="edit-end-date-${saving.id}" class="w-full p-2 border text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" value="${saving.end_date}" />
        </div>
        <button type="submit" id="saveChanges-${saving.id}" class="w-full bg-teal-500 text-white font-semibold p-2 rounded-md hover:bg-teal-600">Guardar Cambios</button>
        <button type="button" id="cancel-${saving.id}" class="w-full mt-2 border border-gray-500 text-gray-500 font-semibold p-2 rounded-md hover:bg-gray-600 hover:text-white">Cancelar</button>
      </div>
    </form>
  `
  return modal
}

export const createDeleteModal = (saving: Saving): HTMLDivElement => {
  const modal = document.createElement('div')
  modal.innerHTML = `
    <form id="delete-modal-${saving.id}" class="fixed inset-0 animate-zoom-in items-center justify-center bg-gray-900 bg-opacity-50 hidden">
      <div class="bg-white text-black p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 class="text-xl font-bold mb-4 text-center">¿Estás seguro de eliminar este objetivo de ahorro: ${saving.name}?</h2>
        <button type="submit" id="confirm-delete-${saving.id}" class="w-full bg-rose-500 text-white font-semibold p-2 rounded-md hover:bg-rose-600">Eliminar</button>
        <button type="button" id="cancel-delete-${saving.id}" class="w-full mt-2 border border-gray-500 text-gray-500 font-semibold p-2 rounded-md hover:bg-gray-600 hover:text-white">Cancelar</button>
      </div>
    </form>
  `
  return modal
}

export const openEditModal = (saving: Saving) => {
  const $editModal = $(`#edit-modal-${saving.id}`)
  $editModal?.classList.replace('hidden', 'flex')
  const $cancelButton = $editModal?.querySelector(`#cancel-${saving.id}`)
  $cancelButton?.addEventListener('click', () => $editModal?.classList.replace('flex', 'hidden'))
}

export const openDeleteModal = (saving: Saving) => {
  const $deleteModal = $(`#delete-modal-${saving.id}`)
  $deleteModal?.classList.replace('hidden', 'flex')
  const $cancelButton = $deleteModal?.querySelector(`#cancel-delete-${saving.id}`)
  $cancelButton?.addEventListener('click', () => $deleteModal?.classList.replace('flex', 'hidden'))
}

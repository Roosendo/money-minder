import type { Transaction, Summary, Saving, Reminder } from '@src/types.d.ts'
import { $ } from '@lib/dom-selector'
import { createGraphic } from '@utils/create-graph'

export const updateMonthText = (monthText: HTMLHeadingElement, date: Date) => {
	const monthNames = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
	]
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
		const categorysEntries = dataEntries.map((entry) => entry.category)
		const totalsEntries = dataEntries.map((entry) => entry.total)
		createGraphic($canvaIngreso, categorysEntries, totalsEntries, 'Ingresos')
	}

	if (dataExits.length === 0) {
		createGraphic($canvaEgreso, ['Sin datos'], [0], 'Egresos')
	} else {
		const categorysExits = dataExits.map((exit) => exit.category)
		const totalsExits = dataExits.map((exit) => exit.total)
		createGraphic($canvaEgreso, categorysExits, totalsExits, 'Gastos')
	}
}

export const updateSummary = (
	dataSummary: Summary,
	$totalIngresos: HTMLSpanElement,
	$totalEgresos: HTMLSpanElement,
	$difference: HTMLSpanElement
) => {
	const totalEntries = dataSummary.totalEntries !== null ? dataSummary.totalEntries : 0
	const totalExits = dataSummary.totalExits !== null ? dataSummary.totalExits : 0
	const balance = (totalEntries - totalExits).toFixed(2)
	$totalIngresos.textContent = `$${totalEntries.toFixed(2)}`
	$totalEgresos.textContent = `$${totalExits.toFixed(2)}`

	$difference.textContent = `$${balance.toString()}`

	if (Number(balance) < 0) {
		$difference.classList.remove('text-teal-600')
		$difference.classList.add('text-rose-600')
	} else {
		$difference.classList.remove('text-rose-600')
		$difference.classList.add('text-teal-600')
	}
}

/* functions for Savings */

export const createSavingGoalElement = (
	saving: Saving,
	showButtons: boolean = true
): HTMLDivElement => {
	const savingGoal = document.createElement('div')
	const percentage = (saving.current_amount / saving.target_amount) * 100
	savingGoal.innerHTML = `
    <div class="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md relative">
      <h3 class="text-lg font-bold mt-2 text-gray-700 dark:text-gray-100">Nombre del objetivo: ${saving.name}</h3>
      <p class="text-gray-600 dark:text-gray-400">Monto objetivo: $${saving.target_amount}</p>
      <p class="text-gray-600 dark:text-gray-400">Monto actual: $${saving.current_amount}</p>
      <div class="w-full bg-gray-200 dark:bg-gray-50 rounded-full h-2 mt-2 mb-3">
        <div class="bg-teal-500 h-2 rounded-full" style="width: ${percentage}%"></div>
      </div>
      ${
				showButtons
					? `
        <button id="editButton-${saving.id}" class="absolute top-3 right-4 font-medium tracking-wide text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">Editar</button>
        <button id="deleteButton-${saving.id}" class="absolute top-3 right-20 font-medium tracking-wide text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">Eliminar</button>
      `
					: ''
			}
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

type SavingOrReminder = Saving | Reminder

export const openEditModal = (item: SavingOrReminder) => {
	const $editModal = $(`#edit-modal-${item.id}`)
	$editModal?.classList.replace('hidden', 'flex')
	const $cancelButton = $editModal?.querySelector(`#cancel-${item.id}`)
	$cancelButton?.addEventListener('click', () => $editModal?.classList.replace('flex', 'hidden'))
}

export const openDeleteModal = (item: SavingOrReminder) => {
	const $deleteModal = $(`#delete-modal-${item.id}`)
	$deleteModal?.classList.replace('hidden', 'flex')
	const $cancelButton = $deleteModal?.querySelector(`#cancel-delete-${item.id}`)
	$cancelButton?.addEventListener('click', () => $deleteModal?.classList.replace('flex', 'hidden'))
}

/* functions for Reminders */

export const createReminderElement = (
	reminder: Reminder,
	showButtons: boolean = true
): HTMLDivElement => {
	const reminderElement = document.createElement('div')
	reminderElement.innerHTML = `
    <div class="dark:bg-gray-700 bg-gray-100 p-6 mb-6 rounded-lg shadow-md flex justify-between items-center relative">
      <div class="flex flex-col">
        <h3 class="text-lg font-bold dark:text-gray-100 text-gray-600">${reminder.title}</h3>
        <p class="dark:text-gray-400 text-gray-600">${reminder.description ?? 'Sin descripción'}</p>
        <p class="dark:text-gray-400 text-gray-600 uppercase">
          <relative-time datetime="${reminder.reminder_date}" lang="es">
            Tu navegador no soporta web components
          </relative-time>
        </p>
      </div>
      ${
				showButtons
					? `
        <button id="deleteButton-${reminder.id}" class="absolute top-3 right-20 font-medium tracking-wide text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">Eliminar</button>
        <button id="editButton-${reminder.id}" class="absolute top-3 right-4 font-medium tracking-wide text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">Editar</button>
      `
					: ''
			}
    </div>
  `
	return reminderElement
}

export const createEditReminderModal = (reminder: Reminder): HTMLDivElement => {
	const modal = document.createElement('div')
	modal.innerHTML = `
    <form id="edit-modal-${reminder.id}" class="fixed inset-0 animate-zoom-in items-center justify-center bg-gray-900 bg-opacity-50 hidden">
      <div class="bg-white text-black p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 class="text-xl font-bold mb-4 text-center">Editar Recordatorio</h2>
        <div class="mb-4">
          <label for="edit-title-${reminder.id}" id="label-edit-title-${reminder.id}" class="block font-semibold mb-2">Título actual</label>
          <input type="text" id="edit-title-${reminder.id}" class="block p-2.5 w-full z-20 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Título del recordatorio" required value="${reminder.title}" />
        </div>
        <div class="mb-4">
          <label for="edit-description-${reminder.id}" class="block text-gray-700 font-semibold mb-2">Descripción actual</label>
          <input type="text" id="edit-description-${reminder.id}" class="block p-2.5 w-full z-20 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" value="${reminder.description}">
        </div>
        <div class="mb-4">
          <label for="edit-reminder-date-${reminder.id}" class="block text-gray-700 font-semibold mb-2">Fecha de recordatorio</label>
          <input type="datetime-local" id="edit-reminder-date-${reminder.id}" class="w-full p-2 border text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" value="${reminder.reminder_date}" />
        </div>
        <button type="submit" id="saveChanges-${reminder.id}" class="w-full bg-teal-500 text-white font-semibold p-2 rounded-md hover:bg-teal-600">Guardar Cambios</button>
        <button type="button" id="cancel-${reminder.id}" class="w-full mt-2 border border-gray-500 text-gray-500 font-semibold p-2 rounded-md hover:bg-gray-600 hover:text-white">Cancelar</button>
      </div>
    </form>
  `
	return modal
}

export const createDeleteReminderModal = (reminder: Reminder): HTMLDivElement => {
	const modal = document.createElement('div')
	modal.innerHTML = `
    <form id="delete-modal-${reminder.id}" class="fixed inset-0 animate-zoom-in items-center justify-center bg-gray-900 bg-opacity-50 hidden">
      <div class="bg-white text-black p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 class="text-xl font-bold mb-4 text-center">¿Estás seguro de eliminar este recordatorio: ${reminder.title}?</h2>
        <button type="submit" id="confirm-delete-${reminder.id}" class="w-full bg-rose-500 text-white font-semibold p-2 rounded-md hover:bg-rose-600">Eliminar</button>
        <button type="button" id="cancel-delete-${reminder.id}" class="w-full mt-2 border border-gray-500 text-gray-500 font-semibold p-2 rounded-md hover:bg-gray-600 hover:text-white">Cancelar</button>
      </div>
    </form>
  `
	return modal
}

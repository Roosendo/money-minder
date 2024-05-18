import type { Transaction, Summary } from '@utils/api'
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

import type {
  Transaction,
  Summary,
  Saving,
  Reminder,
  CashFLow,
  MainCategories
} from '@src/types.d.ts'

const requestOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
}

/**
 * Fetches the categories for a specific month and year.
 * @param month - The month for which to fetch the categories.
 * @param year - The year for which to fetch the categories.
 * @returns An object containing the fetched data entries and exits.
 */
export const fetchCategories = async (month: string, year: string) => {
  const responseEntries = await fetch(`/api/${month}/${year}/entries-by-category`, requestOptions)
  const responseExits = await fetch(`/api/${month}/${year}/exits-by-category`, requestOptions)

  const dataEntries: Transaction[] = responseEntries.ok ? await responseEntries.json() : []
  const dataExits: Transaction[] = responseExits.ok ? await responseExits.json() : []

  return { dataEntries, dataExits }
}

/**
 * Fetches the financial summary for a specific month and year.
 * @param month - The month for which to fetch the summary.
 * @param year - The year for which to fetch the summary.
 * @returns The fetched financial summary.
 * @throws An error if the summary cannot be obtained.
 */
export const fetchSummary = async (month: string, year: string) => {
  const responseSummary = await fetch(`/api/${month}/${year}/financial-summary`, requestOptions)

  if (!responseSummary.ok) {
    throw new Error('No se pudo obtener el resumen financiero')
  }

  const dataSummary: Summary = await responseSummary.json()
  return dataSummary
}

/* functions for Savings */

/**
 * Fetches savings data from the API.
 * @returns A promise that resolves to an array of Saving objects.
 * @throws An error if the network response is not successful.
 */
export async function fetchDataSavings (): Promise<Saving[]> {
  try {
    const response = await fetch('/api/get-savings', requestOptions)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

/**
 * Updates a saving in the database.
 * @param id - The ID of the saving to update.
 * @param requestOptions - The request options to use for the update.
 * @returns A promise that resolves to the response from the API.
 */
export async function updateSaving (id: number, requestOptions: RequestInit): Promise<Response> {
  return fetch(`/api/${id}/update-saving`, requestOptions)
}

/**
 * Deletes a saving from the database.
 * @param id - The ID of the saving to delete.
 * @returns A promise that resolves to the response from the API.
 */
export async function deleteSaving (id: number, requestOptions: RequestInit): Promise<Response> {
  return fetch(`/api/${id}/delete-saving`, requestOptions)
}

/* functions for Reminders */

/**
 * Fetches reminders data from the API.
 * @returns A promise that resolves to an array of Reminder objects.
 * @throws An error if the network response is not successful.
 */
export const fetchDataReminders = async (): Promise<Reminder[]> => {
  try {
    const response = await fetch('/api/get-reminders', requestOptions)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

/**
 * Updates a reminder in the database.
 * @param id - The ID of the reminder to delete.
 * @param requestOptions - The request options to use for the update.
 * @returns A promise that resolves to the response from the API.
 */
export const updateReminder = async (
  id: number,
  requestOptions: RequestInit
): Promise<Response> => {
  return fetch(`/api/${id}/update-reminder`, requestOptions)
}

/**
 * Deletes a reminder from the database.
 * @param id - The ID of the reminder to delete.
 * @param requestOptions - The request options to use for the delete.
 * @returns A promise that resolves to the response from the API.
 */
export const deleteReminder = async (
  id: number,
  requestOptions: RequestInit
): Promise<Response> => {
  return fetch(`/api/${id}/delete-reminder`, requestOptions)
}

export const fetchCashFlow = async (): Promise<CashFLow[]> => {
  const response = await fetch('/api/dashboard/get-cash-flow', requestOptions)

  if (!response.ok) {
    return []
  }

  return response.json()
}

export const fetchMainCategories = async (): Promise<MainCategories[]> => {
  try {
    const response = await fetch('/api/dashboard/main-categories', requestOptions)

    if (!response.ok) {
      throw new Error('La respuesta no fue exitosa')
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

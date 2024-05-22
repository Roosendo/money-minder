// Represents a transaction.
export interface Transaction {
  category: string
  total: number
}

// Represents a summary of transactions.
export interface Summary {
  totalEntries: number
  totalExits: number
}

// Represents a saving.
export interface Saving {
  id: number
  name: string
  target_amount: number
  current_amount: number
  end_date: string
}

const requestOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
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
export async function fetchDataSavings(): Promise<Saving[]> {
  const response = await fetch('/api/get-savings', requestOptions)

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

/**
 * Updates a saving in the database.
 * @param id - The ID of the saving to update.
 * @param requestOptions - The request options to use for the update.
 * @returns A promise that resolves to the response from the API.
 */
export async function updateSaving(id: number, requestOptions: RequestInit): Promise<Response> {
  return fetch(`/api/${id}/update-saving`, requestOptions)
}

/**
 * Deletes a saving from the database.
 * @param id - The ID of the saving to delete.
 * @returns A promise that resolves to the response from the API.
 */
export async function deleteSaving(id: number, requestOptions: RequestInit): Promise<Response> {
  return fetch(`/api/${id}/delete-saving`, requestOptions)
}
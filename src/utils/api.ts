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

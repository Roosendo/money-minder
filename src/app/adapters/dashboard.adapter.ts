import type {
  EntryTransaction,
  ExitTransaction,
  FSClean,
  FinancialSummary,
  Transaction
} from '../models'

/**
 * Converts a FinancialSummary object to an FSClean object.
 *
 * @param data - The FinancialSummary object to be converted.
 * @returns The converted FSClean object.
 */
export const financialSummaryAdapter = (data: FinancialSummary): FSClean => {
  return {
    totalEntries: data.totalEntries ?? 0,
    totalExits: data.totalExits ?? 0
  }
}

/**
 * Transforms an array of EntryTransaction or ExitTransaction objects into an array of Transaction objects.
 *
 * @param data - The array of EntryTransaction or ExitTransaction objects to be transformed.
 * @returns The transformed array of Transaction objects.
 */
export const transformArrayTransactions = (
  data: (EntryTransaction | ExitTransaction)[]
): Transaction[] => {
  return data.map((item) => {
    const id =
      (item as EntryTransaction).entry_id || (item as ExitTransaction).exit_id
    return { ...item, id }
  })
}

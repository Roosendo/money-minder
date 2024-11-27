import type {
  CashFLow,
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

/**
 * Filters out cash flow entries where both total income and total expenses are zero.
 *
 * @param cashFlow - Array of CashFlow objects to be filtered
 * @returns Array of CashFlow objects where either total income or total expenses are non-zero
 */
export const cashFlowAdapter = (cashFlow: CashFLow[]) => {
  return cashFlow.filter(flow => 
    flow.total_ingresos !== 0 || flow.total_egresos !== 0
  )
}

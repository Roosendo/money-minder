import { EntryTransaction, ExitTransaction, FinancialSummary, FSClean, Transaction } from '../models'

export const financialSummaryAdapter = (data: FinancialSummary): FSClean => {
  return {
    totalEntries: data.totalEntries ?? 0,
    totalExits: data.totalExits ?? 0
  }
}

export const transformArrayTransactions = (data: (EntryTransaction | ExitTransaction)[]): Transaction[] => {
  return data.map(item => {
    const id = (item as EntryTransaction).entry_id || (item as ExitTransaction).exit_id
    return { ...item, id }
  })
}

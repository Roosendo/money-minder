import { FinancialSummary, FSClean } from '../models'

export const financialSummaryAdapter = (data: FinancialSummary): FSClean => {
  return {
    totalEntries: data.totalEntries ?? 0,
    totalExits: data.totalExits ?? 0
  }
}

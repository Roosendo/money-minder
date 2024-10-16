import type { CashFLow } from '@app/models'

export function isValidMonth(month: string): boolean {
  return /^(0[1-9]|1[0-2])$/.test(month)
}

export const findTransactionIndex = (cashFlow: CashFLow[], month: string) => {
  return cashFlow.findIndex((transaction) => transaction.month === month)
}

export const updateExistingTransaction = (cashFlow: CashFLow[], index: number, transaction: CashFLow) => {
  cashFlow[index] = transaction
}

export const addNewTransaction = (cashFlow: CashFLow[], transaction: CashFLow) => {
  cashFlow.push(transaction)
}

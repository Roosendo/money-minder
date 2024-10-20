interface BaseTransaction {
  email?: string
  date: string
  amount: number
  category: string
  description?: string
  fullname?: string
}

export interface NewEntry extends BaseTransaction {}
export interface NewExit extends BaseTransaction {
  creditCardId: number | null
  isCreditPayment: boolean
}

export interface NewSaving {
  email?: string
  endDate: string
  name: string
  fullName?: string
  startDate: string
  targetAmount: number
  currentAmount: number
}

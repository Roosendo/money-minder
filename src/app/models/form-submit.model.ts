interface BaseTransaction {
  email?: string
  date: string
  amount: number
  category: string
  description?: string
  fullname?: string
}

export interface NewEntry extends BaseTransaction {}
export interface NewExit extends BaseTransaction {}

export interface UserData {
  IsLoggedIn: boolean
  Sales?: Sale[]
  Incomes?: Income[]
  MonthlyLimit?: number
}

interface Sale {
  IdSale: number
  Amount: number
  Description?: string
  Category: string
  Date: Date
}

interface Income {
  IdIncome: number
  Amount: number
  Description?: string
  Category: string
  Date: Date
}

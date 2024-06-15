export interface Transaction {
  category: string
  total: number
}

export interface Summary {
  totalEntries: number
  totalExits: number
}

export interface Saving {
  id: number
  name: string
  target_amount: number
  current_amount: number
  end_date: string
}

export interface Reminder {
  id: number
  title: string
  description: string
  reminder_date: string
}

export interface CashFLow {
  month: string
  total_ingresos: number
  total_egresos: number
}

export interface FinancialSummary {
  totalEntries: number | null
  totalExits: number | null
}

export interface MainCategories {
  category: string
  total: number
}

export interface RecentTransactions {
  date: string
  category: string
  amount: number
}

export interface Entry {
  date: string
  amount: number
  category: string
  description: string
}

export interface FinancialSummary {
  totalEntries: number | null
  totalExits: number | null
}

export interface FSClean {
  totalEntries: number
  totalExits: number
}

export interface RecentTransactions {
  date: string
  category: string
  amount: number
}

export interface CashFLow {
  month: string
  total_ingresos: number
  total_egresos: number
}

export interface TransactionChart {
  category: string
  total: number
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

export interface Quote {
  phrase: string
  movie: string
  character: string
}

export interface Transaction {
  user_email: string
  amount: number
  description: string
  category: string
  date: string
}

export interface EntryTransaction extends Transaction {
  entry_id: number
}

export interface ExitTransaction extends Transaction {
  exit_id: number
}

export interface Summary {
  totalEntries: number
  totalExits: number
}

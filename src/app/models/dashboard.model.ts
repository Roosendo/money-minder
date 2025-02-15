export interface FinancialSummary {
  totalEntries: number
  totalExits: number
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
  ingresos: number
  egresos: number
  total: number
  category: string
}

export interface Saving {
  id: number
  name: string
  target_amount: number
  current_amount: number
  end_date: string
}

export interface EditSaving {
  id: number
  newSavingName: string
  newTarget: number
  newCurrentAmount: number
  newEndDate: string
}

export interface DeleteSaving {
  email: string
  id: number
}

export interface Reminder {
  id: number
  title: string
  description: string
  reminder_date: string
}

export interface NewReminder {
  title: string
  description: string
  reminderDate: string
}

export interface EditReminder {
  id: number
  newTitle: string
  newDescription: string
  newDate: string
}

export interface Quote {
  phrase: string
  movie: string
  character: string
}

export interface ApiTransaction {
  user_email?: string
  amount: number
  description: string
  category: string
  date: string
}

export interface EntryTransaction extends ApiTransaction {
  entry_id: number
}

export interface ExitTransaction extends ApiTransaction {
  exit_id: number
}

export interface Transaction extends ApiTransaction {
  id: number
  credit_card_id?: number | null
  is_credit_payment?: 0 | 1
}

export interface Summary {
  totalEntries: TotalE
  totalExits:   TotalE
}

interface TotalE {
  amount: number
}

export interface CreditCards {
  credit_card_id: number
  name: string
  cut_off_date: string
  payment_due_date: string
}

export interface Purchases {
  credit_card_id: number
  name: string
  cut_off_date: string
  start_cut_off_date: string
  end_cut_off_date: string
  exit_id: number
  amount: number
  description: string
  date: string
  total_amount: number
}

export interface NewCreditCard {
  name: string
  cutOffDate: string
  paymentDueDate: string
}

export interface Loans {
  id: number
  loan_title: string
  bank_name: string
  interest_rate: number
  loan_amount: number
  loan_start_date: string
  loan_end_date: string
  last_five_payments: Payments[]
  total_payments: number
}

export interface NewLoan {
  loanTitle: string
  bankName: string
  interestRate: number
  loanAmount: number
  loanStartDate: string
  loanEndDate: string
}

export interface Payments {
  id: number
  payment_date: string
  payment_amount: number
}

export interface NewPayment {
  loanId: number
  paymentDate: string
  paymentAmount: number
}

export interface EditPayment {
  paymentId: number
  paymentDate: string
  paymentAmount: number
}

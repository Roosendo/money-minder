export interface FinancialSummary {
  totalEntries: number;
  totalExits: number;
}

export interface FSClean {
  totalEntries: number;
  totalExits: number;
}

export interface RecentTransactions {
  id?: string;
  type?: "income" | "expense";
  date: string;
  category: string;
  amount: number;
  description?: string | null;
  creditCard?: string | null;
}

export interface CashFLow {
  month: string;
  total_ingresos: number;
  total_egresos: number;
  balance?: number;
}

export interface TransactionChart {
  ingresos: number;
  egresos: number;
  total: number;
  category: string;
}

export interface Saving {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
}

export interface EditSaving {
  id: string;
  newSavingName: string;
  newTarget: number;
  newCurrentAmount: number;
  newTargetDate: string;
}

export type ReminderRecurrence = "none" | "monthly" | "yearly";
export type ReminderStatus = "pending" | "done";

export interface Reminder {
  id: string;
  title: string;
  amount: number | null;
  due_at: string;
  recurrence: ReminderRecurrence;
  status: ReminderStatus;
}

export interface NewReminder {
  title: string;
  amount?: number | null;
  dueAt: string;
  recurrence?: ReminderRecurrence;
  status?: ReminderStatus;
}

export interface EditReminder {
  id: string;
  title: string;
  amount: number | null;
  dueAt: string;
  recurrence: ReminderRecurrence;
  status: ReminderStatus;
}

export interface Quote {
  phrase: string;
  movie: string;
  character: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  credit_card_id?: string | null;
  isCredit?: 0 | 1;
}

export interface Summary {
  month: number;
  year: number;
  totalEntries: number;
  totalExits: number;
  netBalance: number;
}

export interface CreditCards {
  id: string;
  name: string;
  last4: string | null;
  credit_limit: number;
  statement_day: number;
  due_day: number;
}

export interface Purchases {
  id: string;
  name: string;
  statementDay: number;
  dueDay: number;
  creditLimit: number;
  startDate: string;
  endDate: string;
  totalSpent: number;
  availableCredit: number;
}

export interface NewCreditCard {
  name: string;
  last4?: string;
  creditLimit: number;
  statementDay: number;
  dueDay: number;
}

export type LoanDirection = "borrowed" | "lent";
export type LoanStatus = "active" | "paid";

export interface Loans {
  id: string;
  name: string;
  direction: LoanDirection;
  principal: number;
  interestRate: number;
  startDate: string;
  dueDate: string | null;
  status: LoanStatus;
  totalPaid: number;
  remaining: number;
  lastFivePayments: Payments[];
}

export interface NewLoan {
  name: string;
  direction: LoanDirection;
  principal: number;
  interestRate?: number;
  startDate: string;
  dueDate?: string;
}

export interface Payments {
  id: string;
  amount: number;
  paidAt: string;
  note: string | null;
}

export interface NewPayment {
  loanId: string;
  amount: number;
  paidAt: string;
  note?: string;
}

export interface EditPayment {
  loanId: string;
  paymentId: string;
  amount: number;
  paidAt: string;
  note?: string;
}

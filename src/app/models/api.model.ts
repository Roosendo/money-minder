/**
 * Raw response types returned by the Money Minder NestJS API (v1).
 *
 * The API serializes Prisma `Decimal` values as numbers through the global
 * `BigIntInterceptor`, and uses UUID strings as identifiers.
 */

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiCategoryRef {
  id: string;
  name: string;
  type?: "income" | "expense";
}

export interface ApiAccountRef {
  id: string;
  name: string;
}

export interface ApiCreditCardRef {
  id: string;
  name: string;
  last4: string | null;
}

export interface ApiEntry {
  id: string;
  user_id: string;
  category_id: string;
  account_id: string | null;
  amount: number;
  date: string;
  description: string | null;
  created_at: string;
  categories?: ApiCategoryRef | null;
  accounts?: ApiAccountRef | null;
}

export interface ApiExit extends ApiEntry {
  credit_card_id: string | null;
  credit_cards?: ApiCreditCardRef | null;
}

export interface ApiSaving {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
}

export type ApiReminderRecurrence = "none" | "monthly" | "yearly";
export type ApiReminderStatus = "pending" | "done";

export interface ApiReminder {
  id: string;
  user_id: string;
  title: string;
  amount: number | null;
  due_at: string;
  recurrence: ApiReminderRecurrence;
  status: ApiReminderStatus;
}

export interface ApiCreditCard {
  id: string;
  user_id: string;
  name: string;
  last4: string | null;
  credit_limit: number;
  statement_day: number;
  due_day: number;
}

export interface ApiPurchaseSummary {
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

export interface ApiLoanPayment {
  id: string;
  amount: number;
  paidAt: string;
  note: string | null;
}

export interface ApiLoan {
  id: string;
  name: string;
  direction: "borrowed" | "lent";
  principal: number;
  interestRate: number;
  startDate: string;
  dueDate: string | null;
  status: "active" | "paid";
  totalPaid: number;
  remaining: number;
  lastFivePayments: ApiLoanPayment[];
}

export interface ApiMonthlySummary {
  month: number;
  year: number;
  totalEntries: number;
  totalExits: number;
  netBalance: number;
}

export interface ApiCategoryBreakdown {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  count?: number;
}

export interface ApiYearlyCategories {
  incomes: ApiCategoryBreakdown[];
  expenses: ApiCategoryBreakdown[];
}

export interface ApiRecentTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  description: string | null;
  creditCard?: string | null;
}

export interface ApiCashFlow {
  month: string;
  total_ingresos: number;
  total_egresos: number;
  balance: number;
}

export interface ApiSessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface ApiSession {
  user: ApiSessionUser;
  session: {
    id: string;
    expiresAt: string;
  };
}

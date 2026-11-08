import type {
  ApiCashFlow,
  ApiCategoryBreakdown,
  ApiCreditCard,
  ApiEntry,
  ApiExit,
  ApiLoan,
  ApiMonthlySummary,
  ApiPurchaseSummary,
  ApiRecentTransaction,
  ApiReminder,
  ApiSaving,
  ApiYearlyCategories,
  CashFLow,
  CreditCards,
  FinancialSummary,
  FSClean,
  Loans,
  Payments,
  Purchases,
  RecentTransactions,
  Reminder,
  Saving,
  Summary,
  Transaction,
  TransactionChart,
} from "../models";

/**
 * Converts a FinancialSummary object to an FSClean object.
 *
 * @param data - The FinancialSummary object to be converted.
 * @returns The converted FSClean object.
 */
export const financialSummaryAdapter = (data: FinancialSummary): FSClean => {
  return {
    totalEntries: data.totalEntries ?? 0,
    totalExits: data.totalExits ?? 0,
  };
};

const toNumber = (value: number | string | null | undefined): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toDate = (value: string | null | undefined): string => {
  if (!value) return "";
  return value.slice(0, 10);
};

/**
 * Converts an API entry or exit into the flat view model used by the tables.
 */
export const transactionAdapter = (data: ApiEntry | ApiExit): Transaction => {
  const exit = data as ApiExit;
  return {
    id: data.id,
    amount: toNumber(data.amount),
    category: data.categories?.name ?? "General",
    description: data.description ?? "",
    date: toDate(data.date),
    credit_card_id: exit.credit_card_id ?? null,
    is_credit_payment: exit.credit_card_id ? 1 : 0,
  };
};

export const transactionsAdapter = (data: (ApiEntry | ApiExit)[]): Transaction[] =>
  data.map(transactionAdapter);

/**
 * Converts a paginated entries/exits response into the flat view model list.
 */
export const paginatedTransactionsAdapter = (data: { items: (ApiEntry | ApiExit)[] }) =>
  transactionsAdapter(data.items ?? []);

/**
 * Converts a cash flow response into the chart view model.
 */
export const cashFlowAdapter = (cashFlow: ApiCashFlow[]): CashFLow[] => {
  return cashFlow
    .map((flow) => ({
      month: flow.month,
      total_ingresos: toNumber(flow.total_ingresos),
      total_egresos: toNumber(flow.total_egresos),
      balance: toNumber(flow.balance),
    }))
    .filter((flow) => flow.total_ingresos !== 0 || flow.total_egresos !== 0);
};

/**
 * Converts the monthly breakdown of a category list into the pie chart model.
 */
export const categoryBreakdownAdapter = (data: ApiCategoryBreakdown[]): TransactionChart[] => {
  return data.map((item) => ({
    category: item.categoryName,
    total: toNumber(item.totalAmount),
    ingresos: toNumber(item.totalAmount),
    egresos: 0,
  }));
};

/**
 * Converts the yearly categories response into the pie chart model.
 *
 * The dashboard shows spending by category, so expenses are used. When a user
 * only has income for the year, incomes are shown instead of an empty chart.
 */
export const yearlyCategoriesAdapter = (data: ApiYearlyCategories): TransactionChart[] => {
  const source = data.expenses?.length ? data.expenses : data.incomes;
  return categoryBreakdownAdapter(source ?? []);
};

/**
 * Converts a monthly summary response into the analysis summary view model.
 */
export const monthlySummaryAdapter = (data: ApiMonthlySummary): Summary => {
  const totalEntries = toNumber(data.totalEntries);
  const totalExits = toNumber(data.totalExits);
  return {
    month: data.month,
    year: data.year,
    totalEntries,
    totalExits,
    netBalance: toNumber(data.netBalance ?? totalEntries - totalExits),
  };
};

/**
 * Converts a recent transactions response into the dashboard list model.
 */
export const recentTransactionsAdapter = (data: ApiRecentTransaction[]): RecentTransactions[] => {
  return data.map((item) => ({
    id: item.id,
    type: item.type,
    amount: toNumber(item.amount),
    category: item.category,
    date: toDate(item.date),
    description: item.description,
    creditCard: item.creditCard ?? null,
  }));
};

export const savingAdapter = (data: ApiSaving): Saving => ({
  id: data.id,
  name: data.name,
  target_amount: toNumber(data.target_amount),
  current_amount: toNumber(data.current_amount),
  target_date: data.target_date ? toDate(data.target_date) : null,
});

export const savingsAdapter = (data: ApiSaving[]): Saving[] => data.map(savingAdapter);

export const reminderAdapter = (data: ApiReminder): Reminder => ({
  id: data.id,
  title: data.title,
  amount: data.amount === null ? null : toNumber(data.amount),
  due_at: data.due_at,
  recurrence: data.recurrence,
  status: data.status,
});

export const remindersAdapter = (data: ApiReminder[]): Reminder[] => data.map(reminderAdapter);

export const creditCardAdapter = (data: ApiCreditCard): CreditCards => ({
  id: data.id,
  name: data.name,
  last4: data.last4 ?? null,
  credit_limit: toNumber(data.credit_limit),
  statement_day: data.statement_day,
  due_day: data.due_day,
});

export const creditCardsAdapter = (data: ApiCreditCard[]): CreditCards[] =>
  data.map(creditCardAdapter);

export const purchaseAdapter = (data: ApiPurchaseSummary): Purchases => ({
  id: data.id,
  name: data.name,
  statementDay: data.statementDay,
  dueDay: data.dueDay,
  creditLimit: toNumber(data.creditLimit),
  startDate: toDate(data.startDate),
  endDate: toDate(data.endDate),
  totalSpent: toNumber(data.totalSpent),
  availableCredit: toNumber(data.availableCredit),
});

export const purchasesAdapter = (data: ApiPurchaseSummary[]): Purchases[] =>
  data.map(purchaseAdapter);

const paymentAdapter = (data: ApiLoan["lastFivePayments"][number]): Payments => ({
  id: data.id,
  amount: toNumber(data.amount),
  paidAt: data.paidAt,
  note: data.note ?? null,
});

export const loanAdapter = (data: ApiLoan): Loans => ({
  id: data.id,
  name: data.name,
  direction: data.direction,
  principal: toNumber(data.principal),
  interestRate: toNumber(data.interestRate),
  startDate: toDate(data.startDate),
  dueDate: data.dueDate ? toDate(data.dueDate) : null,
  status: data.status,
  totalPaid: toNumber(data.totalPaid),
  remaining: toNumber(data.remaining),
  lastFivePayments: (data.lastFivePayments ?? []).map(paymentAdapter),
});

export const loansAdapter = (data: ApiLoan[]): Loans[] => data.map(loanAdapter);

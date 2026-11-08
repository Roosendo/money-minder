import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { type Observable, catchError, map, throwError } from "rxjs";

import {
  cashFlowAdapter,
  categoryBreakdownAdapter,
  creditCardsAdapter,
  financialSummaryAdapter,
  loansAdapter,
  monthlySummaryAdapter,
  paginatedTransactionsAdapter,
  purchasesAdapter,
  recentTransactionsAdapter,
  remindersAdapter,
  savingsAdapter,
  yearlyCategoriesAdapter,
} from "../adapters";
import { API_BASE_URL } from "../constants/api";
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
  Loans,
  Paginated,
  Purchases,
  Quote,
  RecentTransactions,
  Reminder,
  Saving,
  Summary,
  Transaction,
  TransactionChart,
} from "../models";

@Injectable({
  providedIn: "root",
})
export class ApiCallsService {
  private readonly http = inject(HttpClient);
  private readonly year = new Date().getFullYear();

  /**
   * Retrieves the financial summary for a specific year.
   * @returns An Observable that emits the financial summary data.
   */
  getFinancialSummary(): Observable<FinancialSummary> {
    const url = `${API_BASE_URL}/specials/financial-summary-yearly?year=${this.year}`;
    return this.http.get<FinancialSummary>(url).pipe(
      map((result) => financialSummaryAdapter(result)),
      catchError((error) => this.handleError("Financial Summary", error)),
    );
  }

  /**
   * Retrieves the recent transactions.
   * @returns An Observable that emits the recent transactions data.
   */
  getRecentTransactions(): Observable<RecentTransactions[]> {
    const url = `${API_BASE_URL}/specials/recent-transactions?year=${this.year}`;
    return this.http.get<ApiRecentTransaction[]>(url).pipe(
      map((result) => recentTransactionsAdapter(result)),
      catchError((error) => this.handleError("Recent Transactions", error)),
    );
  }

  /**
   * Retrieves the cash flow data.
   * @returns An Observable of type CashFlow[] representing the cash flow data.
   */
  getCashFlow(): Observable<CashFLow[]> {
    const url = `${API_BASE_URL}/specials/cash-flow?year=${this.year}`;
    return this.http.get<ApiCashFlow[]>(url).pipe(
      map((result) => cashFlowAdapter(result)),
      catchError((error) => this.handleError("Cash Flow", error)),
    );
  }

  /**
   * Retrieves the yearly main categories.
   * @returns An Observable of type TransactionChart[] representing the main categories.
   */
  getMainCategories(): Observable<TransactionChart[]> {
    const url = `${API_BASE_URL}/specials/yearly-categories?year=${this.year}`;
    return this.http.get<ApiYearlyCategories>(url).pipe(
      map((result) => yearlyCategoriesAdapter(result)),
      catchError((error) => this.handleError("Main Categories", error)),
    );
  }

  /**
   * Retrieves the savings data.
   * @returns An Observable of type Saving[] representing the savings data.
   */
  getSavings(): Observable<Saving[]> {
    const url = `${API_BASE_URL}/savings`;
    return this.http.get<ApiSaving[]>(url).pipe(
      map((result) => savingsAdapter(result)),
      catchError((error) => this.handleError("Savings", error)),
    );
  }

  /**
   * Retrieves the reminders data.
   * @returns An Observable of type Reminder[] representing the reminders data.
   */
  getReminders(): Observable<Reminder[]> {
    const url = `${API_BASE_URL}/reminders`;
    return this.http.get<ApiReminder[]>(url).pipe(
      map((result) => remindersAdapter(result)),
      catchError((error) => this.handleError("Reminders", error)),
    );
  }

  /**
   * Retrieves the quote of the day.
   * @returns An Observable of type Quote representing the quote of the day.
   */
  getQuote(): Observable<Quote> {
    const url = `${API_BASE_URL}/phrases/daily-phrase`;
    return this.http.get<Quote>(url).pipe(catchError((error) => this.handleError("Quote", error)));
  }

  /**
   * Retrieves the last entries.
   * @returns An Observable of type Transaction[] representing the last entries.
   */
  getLastEntries(): Observable<Transaction[]> {
    const url = `${API_BASE_URL}/entries?page=1&pageSize=15&sortBy=date&sortOrder=desc`;
    return this.http.get<Paginated<ApiEntry>>(url).pipe(
      map((result) => paginatedTransactionsAdapter(result)),
      catchError((error) => this.handleError("Last Entries", error)),
    );
  }

  /**
   * Retrieves the last exits.
   * @returns An Observable of type Transaction[] representing the last exits.
   */
  getLastExits(): Observable<Transaction[]> {
    const url = `${API_BASE_URL}/exits?page=1&pageSize=15&sortBy=date&sortOrder=desc`;
    return this.http.get<Paginated<ApiExit>>(url).pipe(
      map((result) => paginatedTransactionsAdapter(result)),
      catchError((error) => this.handleError("Last Exits", error)),
    );
  }

  /**
   * Retrieves every exit charged to a credit card, newest first.
   */
  getCardTransactions(creditCardId: string): Observable<Transaction[]> {
    const url = `${API_BASE_URL}/exits?creditCardId=${creditCardId}&page=1&pageSize=100&sortBy=date&sortOrder=desc`;
    return this.http.get<Paginated<ApiExit>>(url).pipe(
      map((result) => paginatedTransactionsAdapter(result)),
      catchError((error) => this.handleError("Card Transactions", error)),
    );
  }

  /**
   * Retrieves the exits charged to any credit card.
   */
  getAllCardTransactions(): Observable<Transaction[]> {
    const url = `${API_BASE_URL}/exits?page=1&pageSize=100&sortBy=date&sortOrder=desc`;
    return this.http.get<Paginated<ApiExit>>(url).pipe(
      map((result) =>
        paginatedTransactionsAdapter(result).filter((item) => Boolean(item.credit_card_id)),
      ),
      catchError((error) => this.handleError("Card Transactions", error)),
    );
  }

  /**
   * Retrieves the analysis summary for a specific year and month.
   *
   * @param year - The year of the analysis summary.
   * @param month - The month of the analysis summary (01-12).
   * @returns An Observable that emits the analysis summary.
   */
  getAnalysisSummary(year: number, month: string): Observable<Summary> {
    const url = `${API_BASE_URL}/specials/financial-summary-monthly?year=${year}&month=${Number(month)}`;
    return this.http.get<ApiMonthlySummary>(url).pipe(
      map((result) => monthlySummaryAdapter(result)),
      catchError((error) => this.handleError("Analysis Summary", error)),
    );
  }

  /**
   * Retrieves monthly entries by category for a specific year and month.
   * @param year - The year of the entries.
   * @param month - The month of the entries (01-12).
   * @returns An Observable of TransactionChart array representing the monthly entries.
   */
  getMonthlyEntries(year: number, month: string): Observable<TransactionChart[]> {
    const url = `${API_BASE_URL}/entries/summary/monthly?year=${year}&month=${Number(month)}`;
    return this.http.get<ApiCategoryBreakdown[]>(url).pipe(
      map((result) => categoryBreakdownAdapter(result)),
      catchError((error) => this.handleError("Monthly Entries", error)),
    );
  }

  /**
   * Retrieves monthly exits by category for a specific year and month.
   *
   * @param year - The year for which to retrieve the exits.
   * @param month - The month for which to retrieve the exits (01-12).
   * @returns An Observable that emits an array of TransactionChart objects representing the monthly exits.
   */
  getMonthlyExits(year: number, month: string): Observable<TransactionChart[]> {
    const url = `${API_BASE_URL}/exits/summary/monthly?year=${year}&month=${Number(month)}`;
    return this.http.get<ApiCategoryBreakdown[]>(url).pipe(
      map((result) => categoryBreakdownAdapter(result)),
      catchError((error) => this.handleError("Monthly Exits", error)),
    );
  }

  getCreditCards(): Observable<CreditCards[]> {
    const url = `${API_BASE_URL}/credit-cards`;
    return this.http.get<ApiCreditCard[]>(url).pipe(
      map((result) => creditCardsAdapter(result)),
      catchError((error) => this.handleError("Credit Cards", error)),
    );
  }

  getPurchases(): Observable<Purchases[]> {
    const url = `${API_BASE_URL}/credit-cards/purchases`;
    return this.http.get<ApiPurchaseSummary[]>(url).pipe(
      map((result) => purchasesAdapter(result)),
      catchError((error) => this.handleError("Purchases", error)),
    );
  }

  getLoans(): Observable<Loans[]> {
    const url = `${API_BASE_URL}/loans`;
    return this.http.get<ApiLoan[]>(url).pipe(
      map((result) => loansAdapter(result)),
      catchError((error) => this.handleError("Loans", error)),
    );
  }

  private handleError(label: string, error: unknown) {
    console.error(`Error fetching ${label}`, error);
    return throwError(() => new Error(`Error fetching ${label}`));
  }
}

import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

import { CashFLow, FinancialSummary, FSClean, TransactionChart, Quote, RecentTransactions, Reminder, Saving, Summary, EntryTransaction, ExitTransaction, Transaction } from '../models'
import { financialSummaryAdapter, transformArrayTransactions } from '../adapters'
import { AuthCacheService } from '.'

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  private readonly API_URL = 'https://money-minder-api.vercel.app/api'
  private year = new Date().getFullYear()
  private readonly authCacheService = inject(AuthCacheService)
  private email = this.authCacheService.getUser()?.email

  constructor (private http: HttpClient) {}

  /**
   * Retrieves the financial summary for a specific year.
   * @returns An Observable that emits the financial summary data.
   */
  getFinancialSummary (): Observable<FSClean> {
    const url = `${this.API_URL}/specials/financial-summary-yearly?email=${this.email}&year=${this.year}`
    return this.http.get<FinancialSummary>(url)
      .pipe(map((result) => financialSummaryAdapter(result)))
  }

  /**
   * Retrieves the recent transactions.
   * @returns An Observable that emits the recent transactions data.
   */
  getRecentTransactions (): Observable<RecentTransactions[]> {
    const url = `${this.API_URL}/specials/recent-transactions?email=${this.email}&year=${this.year}`
    return this.http.get<RecentTransactions[]>(url)
      .pipe(map((result) => result))
  }

  /**
   * Retrieves the cash flow data.
   * @returns An Observable of type CashFlow[] representing the cash flow data.
   */
  getCashFlow (): Observable<CashFLow[]> {
    const url = `${this.API_URL}/specials/cash-flow?email=${this.email}&year=${this.year}`
    return this.http.get<CashFLow[]>(url)
      .pipe(map((result) => result))
  }

  /**
   * Retrieves the yearly main categories.
   * @returns An Observable of type TransactionChart[] representing the main categories.
   */
  getMainCategories (): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/specials/yearly-categories?email=${this.email}&year=${this.year}`
    return this.http.get<TransactionChart[]>(url)
      .pipe(map((result) => result))
  }

  /**
   * Retrieves the savings data.
   * @returns An Observable of type Saving[] representing the savings data.
   */
  getSavings (): Observable<Saving[]> {
    const url = `${this.API_URL}/savings/get-savings?email=${this.email}`
    return this.http.get<Saving[]>(url)
      .pipe(map((result) => result))
  }

  /**
   * Retrieves the reminders data.
   * @returns An Observable of type Reminder[] representing the reminders data.
   */
  getReminders (): Observable<Reminder[]> {
    const url = `${this.API_URL}/reminders/get-reminders?email=${this.email}`
    return this.http.get<Reminder[]>(url)
      .pipe(map((result) => result))
  }

  /**
   * Retrieves the quote of the day.
   * @returns An Observable of type Quote representing the quote of the day.
   */
  getQuote (): Observable<Quote> {
    const url = `${this.API_URL}/phrases/daily-phrase`
    return this.http.get<Quote>(url)
      .pipe(map((result) => result))
  }

  /**
   * Retrieves the last entries.
   * @returns An Observable of type Transaction[] representing the last entries.
   */
  getLastEntries (): Observable<Transaction[]> {
    const url = `${this.API_URL}/entries/get-entries?email=${this.email}`
    return this.http.get<EntryTransaction[]>(url)
      .pipe(map((result) => transformArrayTransactions(result)))
  }

  /**
   * Retrieves the last exits.
   * @returns An Observable of type Transaction[] representing the last exits.
   */
  getLastExits (): Observable<Transaction[]> {
    const url = `${this.API_URL}/exits/get-exits?email=${this.email}`
    return this.http.get<ExitTransaction[]>(url)
      .pipe(map((result) => transformArrayTransactions(result)))
  }

  /**
   * Retrieves the analysis summary for a specific year and month.
   *
   * @param year - The year of the analysis summary.
   * @param month - The month of the analysis summary.
   * @returns An Observable that emits the analysis summary.
   */
  getAnalysisSummary (year: number, month: string): Observable<Summary> {
    const url = `${this.API_URL}/specials/financial-summary-monthly?email=${this.email}&year=${year}&month=${month}`
    return this.http.get<Summary>(url)
      .pipe(map((result) => result))
  }

  /**
   * Retrieves monthly entries by category for a specific year and month.
   * @param year - The year of the entries.
   * @param month - The month of the entries.
   * @returns An Observable of TransactionChart array representing the monthly entries.
   */
  getMonthlyEntries (year: number, month: string): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/entries/get-entries-by-category-monthly?email=${this.email}&year=${year}&month=${month}`
    return this.http.get<TransactionChart[]>(url)
      .pipe(map((result) => result))
  }

  /**
   * Retrieves monthly exits by category for a specific year and month.
   *
   * @param year - The year for which to retrieve the exits.
   * @param month - The month for which to retrieve the exits.
   * @returns An Observable that emits an array of TransactionChart objects representing the monthly exits.
   */
  getMonthlyExits (year: number, month: string): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/exits/get-exits-by-category-monthly?email=${this.email}&year=${year}&month=${month}`
    return this.http.get<TransactionChart[]>(url)
      .pipe(map((result) => result))
  }
}

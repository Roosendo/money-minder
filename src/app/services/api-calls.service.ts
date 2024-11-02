import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable, catchError, map, throwError } from 'rxjs'

import { AuthCacheService } from '.'
import {
  financialSummaryAdapter,
  transformArrayTransactions
} from '../adapters'
import type {
  CashFLow,
  CreditCards,
  EntryTransaction,
  ExitTransaction,
  FinancialSummary,
  Loans,
  Purchases,
  Quote,
  RecentTransactions,
  Reminder,
  Saving,
  Summary,
  Transaction,
  TransactionChart
} from '../models'

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  private readonly API_URL = 'https://money-minder-api.vercel.app/api'
  private year = new Date().getFullYear()
  private readonly authCacheService = inject(AuthCacheService)
  private email = this.authCacheService.getUser()?.email
  private http

  constructor() {
    this.http = inject(HttpClient)
  }

  /**
   * Retrieves the financial summary for a specific year.
   * @returns An Observable that emits the financial summary data.
   */
  getFinancialSummary(): Observable<FinancialSummary> {
    const url = `${this.API_URL}/specials/financial-summary-yearly?email=${this.email}&year=${this.year}`
    return this.http
      .get<FinancialSummary>(url)
      .pipe(
        map((result) => financialSummaryAdapter(result)),
        catchError((error) => {
          console.error('Error fetching Financial Summary', error)
          return throwError(() => new Error('Error fetching Financial Summary'))
        })
      )
  }

  /**
   * Retrieves the recent transactions.
   * @returns An Observable that emits the recent transactions data.
   */
  getRecentTransactions(): Observable<RecentTransactions[]> {
    const url = `${this.API_URL}/specials/recent-transactions?email=${this.email}&year=${this.year}`
    return this.http
      .get<RecentTransactions[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Recent Transactions', error)
          return throwError(() => new Error('Error fetching Recent Transactions'))
        })
      )
  }

  /**
   * Retrieves the cash flow data.
   * @returns An Observable of type CashFlow[] representing the cash flow data.
   */
  getCashFlow(): Observable<CashFLow[]> {
    const url = `${this.API_URL}/specials/cash-flow?email=${this.email}&year=${this.year}`
    return this.http.get<CashFLow[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Cash Flow', error)
          return throwError(() => new Error('Error fetching Cash Flow'))
        })
      )
  }

  /**
   * Retrieves the yearly main categories.
   * @returns An Observable of type TransactionChart[] representing the main categories.
   */
  getMainCategories(): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/specials/yearly-categories?email=${this.email}&year=${this.year}`
    return this.http.get<TransactionChart[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Main Categories', error)
          return throwError(() => new Error('Error fetching Main Categories'))
        })
      )
  }

  /**
   * Retrieves the savings data.
   * @returns An Observable of type Saving[] representing the savings data.
   */
  getSavings(): Observable<Saving[]> {
    const url = `${this.API_URL}/savings/get-savings?email=${this.email}`
    return this.http.get<Saving[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Savings', error)
          return throwError(() => new Error('Error fetching Savings'))
        })
      )
  }

  /**
   * Retrieves the reminders data.
   * @returns An Observable of type Reminder[] representing the reminders data.
   */
  getReminders(): Observable<Reminder[]> {
    const url = `${this.API_URL}/reminders/get-reminders?email=${this.email}`
    return this.http.get<Reminder[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Reminders', error)
          return throwError(() => new Error('Error fetching Reminders'))
        })
      )
  }

  /**
   * Retrieves the quote of the day.
   * @returns An Observable of type Quote representing the quote of the day.
   */
  getQuote(): Observable<Quote> {
    const url = `${this.API_URL}/phrases/daily-phrase`
    return this.http.get<Quote>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Quote', error)
          return throwError(() => new Error('Error fetching Quote'))
        })
      )
  }

  /**
   * Retrieves the last entries.
   * @returns An Observable of type Transaction[] representing the last entries.
   */
  getLastEntries(): Observable<Transaction[]> {
    const url = `${this.API_URL}/entries/get-entries?email=${this.email}`
    return this.http
      .get<EntryTransaction[]>(url)
      .pipe(
        map((result) => transformArrayTransactions(result)),
        catchError((error) => {
          console.error('Error fetching Last Entries', error)
          return throwError(() => new Error('Error fetching Last Entries'))
        })
      )
  }

  /**
   * Retrieves the last exits.
   * @returns An Observable of type Transaction[] representing the last exits.
   */
  getLastExits(): Observable<Transaction[]> {
    const url = `${this.API_URL}/exits/get-exits?email=${this.email}`
    return this.http
      .get<ExitTransaction[]>(url)
      .pipe(
        map((result) => transformArrayTransactions(result)),
        catchError((error) => {
          console.error('Error fetching Last Exits', error)
          return throwError(() => new Error('Error fetching Last Exits'))
        })
      )
  }

  /**
   * Retrieves the analysis summary for a specific year and month.
   *
   * @param year - The year of the analysis summary.
   * @param month - The month of the analysis summary.
   * @returns An Observable that emits the analysis summary.
   */
  getAnalysisSummary(year: number, month: string): Observable<Summary> {
    const url = `${this.API_URL}/specials/financial-summary-monthly?email=${this.email}&year=${year}&month=${month}`
    return this.http.get<Summary>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Analysis Summary', error)
          return throwError(() => new Error('Error fetching Analysis Summary'))
        })
      )
  }

  /**
   * Retrieves monthly entries by category for a specific year and month.
   * @param year - The year of the entries.
   * @param month - The month of the entries.
   * @returns An Observable of TransactionChart array representing the monthly entries.
   */
  getMonthlyEntries(
    year: number,
    month: string
  ): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/entries/get-entries-by-category-monthly?email=${this.email}&year=${year}&month=${month}`
    return this.http.get<TransactionChart[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Monthly Entries', error)
          return throwError(() => new Error('Error fetching Monthly Entries'))
        })
      )
  }

  /**
   * Retrieves monthly exits by category for a specific year and month.
   *
   * @param year - The year for which to retrieve the exits.
   * @param month - The month for which to retrieve the exits.
   * @returns An Observable that emits an array of TransactionChart objects representing the monthly exits.
   */
  getMonthlyExits(year: number, month: string): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/exits/get-exits-by-category-monthly?email=${this.email}&year=${year}&month=${month}`
    return this.http.get<TransactionChart[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Monthly Exits', error)
          return throwError(() => new Error('Error fetching Monthly Exits'))
        })
      )
  }

  getCreditCards(): Observable<CreditCards[]> {
    const url = `${this.API_URL}/credit-cards?email=${this.email}`
    return this.http.get<CreditCards[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Credit Cards', error)
          return throwError(() => new Error('Error fetching Credit Cards'))
        })
      )
  }

  getPurchases(): Observable<Purchases[]> {
    const url = `${this.API_URL}/credit-cards/purchases?email=${this.email}`
    return this.http.get<Purchases[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Purchases', error)
          return throwError(() => new Error('Error fetching Purchases'))
        })
      )
  }

  getLoans(): Observable<Loans[]> {
    const url = `${this.API_URL}/loans?email=${this.email}`
    return this.http.get<Loans[]>(url)
      .pipe(
        map((result) => result),
        catchError((error) => {
          console.error('Error fetching Loans', error)
          return throwError(() => new Error('Error fetching Loans'))
        })
      )
  }
}

import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

import { CashFLow, FinancialSummary, FSClean, TransactionChart, Quote, RecentTransactions, Reminder, Saving, Summary, EntryTransaction, ExitTransaction } from '../models'
import { financialSummaryAdapter } from '../adapters'
import { AuthCacheService } from '.'

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  private readonly API_URL = 'https://money-minder-api.vercel.app/api'
  private year = new Date().getFullYear()
  private readonly authCacheService = inject(AuthCacheService)
  private email = this.authCacheService.getUser()?.email

  constructor(private http: HttpClient) {}

  getFinancialSummary(): Observable<FSClean> {
    const url = `${this.API_URL}/specials/financial-summary-yearly?email=${this.email}&year=${this.year}`
    return this.http.get<FinancialSummary>(url)
      .pipe(map((result) => financialSummaryAdapter(result)))
  }

  getRecentTransactions(): Observable<RecentTransactions[]> {
    const url = `${this.API_URL}/specials/recent-transactions?email=${this.email}&year=${this.year}`
    return this.http.get<RecentTransactions[]>(url)
      .pipe(map((result) => result))
  }

  getCashFlow(): Observable<CashFLow[]> {
    const url = `${this.API_URL}/specials/cash-flow?email=${this.email}&year=${this.year}`
    return this.http.get<CashFLow[]>(url)
      .pipe(map((result) => result))
  }

  getMainCategories(): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/specials/yearly-categories?email=${this.email}&year=${this.year}`
    return this.http.get<TransactionChart[]>(url)
      .pipe(map((result) => result))
  }

  getSavings(): Observable<Saving[]> {
    const url = `${this.API_URL}/savings/get-savings?email=${this.email}`
    return this.http.get<Saving[]>(url)
      .pipe(map((result) => result))
  }

  getReminders(): Observable<Reminder[]> {
    const url = `${this.API_URL}/reminders/get-reminders?email=${this.email}`
    return this.http.get<Reminder[]>(url)
      .pipe(map((result) => result))
  }

  getQuote(): Observable<Quote> {
    const url = `${this.API_URL}/phrases/daily-phrase`
    return this.http.get<Quote>(url)
      .pipe(map((result) => result))
  }

  getLastEntries(): Observable<EntryTransaction[]> {
    const url = `${this.API_URL}/entries/get-entries?email=${this.email}`
    return this.http.get<EntryTransaction[]>(url)
      .pipe(map((result) => result))
  }

  getLastExits(): Observable<ExitTransaction[]> {
    const url = `${this.API_URL}/exits/get-exits?email=${this.email}`
    return this.http.get<ExitTransaction[]>(url)
      .pipe(map((result) => result))
  }

  getAnalysisSummary(year: number, month: string): Observable<Summary> {
    const url = `${this.API_URL}/specials/financial-summary-monthly?email=${this.email}&year=${year}&month=${month}`
    return this.http.get<Summary>(url)
      .pipe(map((result) => result))
  }

  getMonthlyEntries(year: number, month: string): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/entries/get-entries-by-category-monthly?email=${this.email}&year=${year}&month=${month}`;
    return this.http.get<TransactionChart[]>(url)
      .pipe(map((result) => result))
  }

  getMonthlyExits(year: number, month: string): Observable<TransactionChart[]> {
    const url = `${this.API_URL}/exits/get-exits-by-category-monthly?email=${this.email}&year=${year}&month=${month}`;
    return this.http.get<TransactionChart[]>(url)
      .pipe(map((result) => result))
  }
}

import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

import { CashFLow, FinancialSummary, FSClean, MainCategories, Quote, RecentTransactions, Reminder, Saving, Transaction } from '../models'
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

  getMainCategories(): Observable<MainCategories[]> {
    const url = `${this.API_URL}/specials/yearly-categories?email=${this.email}&year=${this.year}`
    return this.http.get<MainCategories[]>(url)
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

  getLastEntries(): Observable<Transaction[]> {
    const url = `${this.API_URL}/entries/get-entries?email=${this.email}`
    return this.http.get<Transaction[]>(url)
      .pipe(map((result) => result))
  }

  getLastExits(): Observable<Transaction[]> {
    const url = `${this.API_URL}/exits/get-exits?email=${this.email}`
    return this.http.get<Transaction[]>(url)
      .pipe(map((result) => result))
  }
}

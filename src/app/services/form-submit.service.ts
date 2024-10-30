import { HttpClient, type HttpErrorResponse } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable, catchError, throwError } from 'rxjs'

import { AuthCacheService } from '.'
import type {
  EditReminder,
  EditSaving,
  NewCreditCard,
  NewEntry,
  NewExit,
  NewReminder,
  NewSaving
} from '../models'

@Injectable({
  providedIn: 'root'
})
export class FormSubmitService {
  private readonly API_URL = 'https://money-minder-api.vercel.app/api'
  private readonly authCacheService = inject(AuthCacheService)
  private email = this.authCacheService.getUser()?.email
  private fullName = `${this.authCacheService.getUser()?.firstName} ${this.authCacheService.getUser()?.lastName}`
  private requestOptions = {
    headers: { 'Content-Type': 'application/json' }
  }
  private http

  constructor() {
    this.http = inject(HttpClient)
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      )
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    )
  }

  /**
   * Submits a new entry.
   * @param formNewEntry - The data for the new entry.
   * @returns An Observable that emits the response from the server.
   */
  entrySubmit(formNewEntry: NewEntry) {
    const url = `${this.API_URL}/entries/new-entry`
    const { email, fullName } = this
    return this.http
      .post(
        url,
        JSON.stringify({ email, fullName, ...formNewEntry }),
        this.requestOptions
      )
      .pipe(catchError(this.handleError))
  }

  /**
   * Edits an entry.
   * @param formNewExit - The data for the new exit.
   * @returns An Observable that emits the response from the server.
   */
  exitSubmit(formNewExit: NewExit) {
    const url = `${this.API_URL}/exits/new-exit`
    const { email, fullName } = this
    return this.http
      .post(
        url,
        JSON.stringify({ email, fullName, ...formNewExit }),
        this.requestOptions
      )
      .pipe(catchError(this.handleError))
  }

  /**
   * Submits a new saving.
   * @param formNewSaving - The data for the new saving.
   * @returns An Observable that emits the response from the server.
   */
  savingSubmit(formNewSaving: NewSaving) {
    const url = `${this.API_URL}/savings/new-saving`
    const { email, fullName } = this
    return this.http
      .post(
        url,
        JSON.stringify({ email, fullName, ...formNewSaving }),
        this.requestOptions
      )
      .pipe(catchError(this.handleError))
  }

  /**
   * Edits a saving.
   * @param formEditSaving - The data for editing the saving.
   * @returns An Observable that emits the response from the server.
   */
  editSaving(formEditSaving: EditSaving) {
    const url = `${this.API_URL}/savings/update-saving`
    const { email } = this
    return this.http
      .patch(
        url,
        JSON.stringify({ ...formEditSaving, email }),
        this.requestOptions
      )
      .pipe(catchError(this.handleError))
  }

  /**
   * Deletes a saving.
   * @param id - The ID of the saving to delete.
   * @returns An Observable that emits the response from the server.
   */
  deleteSaving(id: number) {
    const url = `${this.API_URL}/savings/delete-saving?id=${id}&email=${this.email}`
    return this.http
      .delete(url, this.requestOptions)
      .pipe(catchError(this.handleError))
  }

  /**
   * Submits a new reminder.
   *
   * @param formNewReminder - The new reminder data.
   * @returns An Observable that emits the response from the server.
   */
  reminderSubmit(formNewReminder: NewReminder) {
    const url = `${this.API_URL}/reminders/new-reminder`
    const { email, fullName } = this
    return this.http
      .post(
        url,
        JSON.stringify({ ...formNewReminder, email, fullName }),
        this.requestOptions
      )
      .pipe(catchError(this.handleError))
  }

  /**
   * Edits a reminder.
   *
   * @param formEditReminder - The data for editing the reminder.
   * @returns An Observable that emits the response from the server.
   */
  editReminder(formEditReminder: EditReminder) {
    const url = `${this.API_URL}/reminders/update-reminder`
    const { email } = this
    return this.http
      .patch(
        url,
        JSON.stringify({ ...formEditReminder, email }),
        this.requestOptions
      )
      .pipe(catchError(this.handleError))
  }

  /**
   * Deletes a reminder.
   *
   * @param id - The ID of the reminder to delete.
   * @returns A `Observable` that emits the response from the server.
   */
  deleteReminder(id: number) {
    const url = `${this.API_URL}/reminders/delete-reminder?id=${id}&email=${this.email}`
    return this.http
      .delete(url, this.requestOptions)
      .pipe(catchError(this.handleError))
  }

  creditCardSubmit(creditCardSubmit: NewCreditCard) {
    const url = `${this.API_URL}/credit-cards`
    const { email, fullName } = this
    return this.http
      .post(
        url,
        JSON.stringify({ email, fullName, ...creditCardSubmit }),
        this.requestOptions
      )
      .pipe(catchError(this.handleError))
  }

  deleteCreditCard(id: number) {
    const url = `${this.API_URL}/credit-cards/${id}`
    return this.http
      .delete(url, { ...this.requestOptions, body: { userEmail: this.email } })
      .pipe(catchError(this.handleError))
  }
}

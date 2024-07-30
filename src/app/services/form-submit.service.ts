import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, Observable, throwError } from 'rxjs'

import { AuthCacheService } from '.'
import { EditSaving, NewEntry, NewExit, NewSaving } from '../models'

@Injectable({
  providedIn: 'root'
})
export class FormSubmitService {
  private readonly API_URL = 'https://money-minder-api.vercel.app/api'
  private readonly authCacheService = inject(AuthCacheService)
  private email = this.authCacheService.getUser()?.email
  private fullName = this.authCacheService.getUser()?.firstName + ' ' + this.authCacheService.getUser()?.lastName
  private requestOptions = {
    headers: { 'Content-Type': 'application/json' }
  }

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`)
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'))
  }

  entrySubmit(formNewEntry: NewEntry) {
    const url = `${this.API_URL}/entries/new-entry`
    const { email, fullName } = this
    return this.http.post(url, JSON.stringify({ email, fullName, ...formNewEntry }), this.requestOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  exitSubmit(formNewExit: NewExit) {
    const url = `${this.API_URL}/exits/new-exit`
    const { email, fullName } = this
    return this.http.post(url, JSON.stringify({ email, fullName, ...formNewExit }), this.requestOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  savingSubmit(formNewSaving: NewSaving) {
    const url = `${this.API_URL}/savings/new-saving`
    const { email, fullName } = this
    return this.http.post(url, JSON.stringify({ email, fullName, ...formNewSaving }), this.requestOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  editSaving(formEditSaving: EditSaving) {
    const url = `${this.API_URL}/savings/update-saving`
    const { email } = this
    return this.http.patch(url, JSON.stringify({ ...formEditSaving, email }), this.requestOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteSaving(id: number) {
    const url = `${this.API_URL}/savings/delete-saving?id=${id}&email=${this.email}`
    return this.http.delete(url, this.requestOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
}

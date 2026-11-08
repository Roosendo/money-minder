import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { type Observable, catchError, map, throwError } from "rxjs";

import { API_BASE_URL } from "../constants/api";
import { creditCardAdapter, loanAdapter, reminderAdapter, savingAdapter } from "../adapters";
import type {
  ApiCreditCard,
  ApiLoan,
  ApiReminder,
  ApiSaving,
  CreditCards,
  EditPayment,
  EditReminder,
  EditSaving,
  NewCreditCard,
  NewEntry,
  NewExit,
  NewLoan,
  NewPayment,
  NewReminder,
  NewSaving,
  Reminder,
  Saving,
} from "../models";

/**
 * Writes to the Money Minder API (v1).
 *
 * The backend derives the user from the authenticated session, so payloads no
 * longer carry `email` or `fullName`. Nest's validation pipe rejects unknown
 * properties, which is why every payload is built explicitly.
 */
@Injectable({
  providedIn: "root",
})
export class FormSubmitService {
  private readonly http = inject(HttpClient);

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error("Something bad happened; please try again later."));
  }

  /**
   * Submits a new entry.
   * @param formNewEntry - The data for the new entry.
   * @returns An Observable that emits the new entry id.
   */
  entrySubmit(formNewEntry: NewEntry): Observable<string> {
    const url = `${API_BASE_URL}/entries`;
    return this.http
      .post<{ id: string }>(url, {
        amount: Number(formNewEntry.amount),
        date: formNewEntry.date,
        category: formNewEntry.category,
        description: formNewEntry.description || undefined,
      })
      .pipe(
        map((response) => response.id),
        catchError(this.handleError),
      );
  }

  /**
   * Submits a new exit.
   * @param formNewExit - The data for the new exit.
   * @returns An Observable that emits the new exit id.
   */
  exitSubmit(formNewExit: NewExit): Observable<string> {
    const url = `${API_BASE_URL}/exits`;
    return this.http
      .post<{ id: string }>(url, {
        amount: Number(formNewExit.amount),
        date: formNewExit.date,
        category: formNewExit.category,
        description: formNewExit.description || undefined,
        creditCardId: formNewExit.creditCardId || undefined,
      })
      .pipe(
        map((response) => response.id),
        catchError(this.handleError),
      );
  }

  /**
   * Creates a saving goal.
   */
  savingSubmit(formNewSaving: NewSaving): Observable<Saving> {
    const url = `${API_BASE_URL}/savings`;
    return this.http
      .post<ApiSaving>(url, {
        name: formNewSaving.name,
        targetAmount: Number(formNewSaving.targetAmount),
        currentAmount: Number(formNewSaving.currentAmount ?? 0),
        targetDate: formNewSaving.targetDate || undefined,
      })
      .pipe(
        map((response) => savingAdapter(response)),
        catchError(this.handleError),
      );
  }

  /**
   * Updates a saving goal.
   */
  editSaving(formEditSaving: EditSaving): Observable<Saving> {
    const url = `${API_BASE_URL}/savings/${formEditSaving.id}`;
    return this.http
      .patch<ApiSaving>(url, {
        name: formEditSaving.newSavingName,
        targetAmount: Number(formEditSaving.newTarget),
        currentAmount: Number(formEditSaving.newCurrentAmount),
        targetDate: formEditSaving.newTargetDate || undefined,
      })
      .pipe(
        map((response) => savingAdapter(response)),
        catchError(this.handleError),
      );
  }

  /**
   * Deletes a saving goal.
   * @param id - The id of the saving to delete.
   */
  deleteSaving(id: string): Observable<{ deleted: boolean }> {
    const url = `${API_BASE_URL}/savings/${id}`;
    return this.http.delete<{ deleted: boolean }>(url).pipe(catchError(this.handleError));
  }

  /**
   * Submits a new reminder.
   *
   * @param formNewReminder - The new reminder data.
   */
  reminderSubmit(formNewReminder: NewReminder): Observable<Reminder> {
    const url = `${API_BASE_URL}/reminders`;
    return this.http
      .post<ApiReminder>(url, {
        title: formNewReminder.title,
        amount:
          formNewReminder.amount === null || formNewReminder.amount === undefined
            ? undefined
            : Number(formNewReminder.amount),
        dueAt: formNewReminder.dueAt,
        recurrence: formNewReminder.recurrence ?? "none",
        status: formNewReminder.status ?? "pending",
      })
      .pipe(
        map((response) => reminderAdapter(response)),
        catchError(this.handleError),
      );
  }

  /**
   * Edits a reminder.
   *
   * @param formEditReminder - The data for editing the reminder.
   */
  editReminder(formEditReminder: EditReminder): Observable<Reminder> {
    const url = `${API_BASE_URL}/reminders/${formEditReminder.id}`;
    return this.http
      .patch<ApiReminder>(url, {
        title: formEditReminder.title,
        amount:
          formEditReminder.amount === null || formEditReminder.amount === undefined
            ? undefined
            : Number(formEditReminder.amount),
        dueAt: formEditReminder.dueAt,
        recurrence: formEditReminder.recurrence,
        status: formEditReminder.status,
      })
      .pipe(
        map((response) => reminderAdapter(response)),
        catchError(this.handleError),
      );
  }

  /**
   * Deletes a reminder.
   * @param id - The id of the reminder to delete.
   */
  deleteReminder(id: string): Observable<{ deleted: boolean }> {
    const url = `${API_BASE_URL}/reminders/${id}`;
    return this.http.delete<{ deleted: boolean }>(url).pipe(catchError(this.handleError));
  }

  creditCardSubmit(creditCardSubmit: NewCreditCard): Observable<CreditCards> {
    const url = `${API_BASE_URL}/credit-cards`;
    return this.http
      .post<ApiCreditCard>(url, {
        name: creditCardSubmit.name,
        last4: creditCardSubmit.last4 || undefined,
        creditLimit: Number(creditCardSubmit.creditLimit),
        statementDay: Number(creditCardSubmit.statementDay),
        dueDay: Number(creditCardSubmit.dueDay),
      })
      .pipe(
        map((response) => creditCardAdapter(response)),
        catchError(this.handleError),
      );
  }

  deleteCreditCard(id: string): Observable<{ deleted: boolean }> {
    const url = `${API_BASE_URL}/credit-cards/${id}`;
    return this.http.delete<{ deleted: boolean }>(url).pipe(catchError(this.handleError));
  }

  addLoan(loan: NewLoan): Observable<unknown> {
    const url = `${API_BASE_URL}/loans`;
    return this.http
      .post<ApiLoan>(url, {
        name: loan.name,
        direction: loan.direction,
        principal: Number(loan.principal),
        interestRate: Number(loan.interestRate ?? 0),
        startDate: loan.startDate,
        dueDate: loan.dueDate || undefined,
      })
      .pipe(
        map((response) => loanAdapter(response)),
        catchError(this.handleError),
      );
  }

  addPayment(payment: NewPayment): Observable<unknown> {
    const url = `${API_BASE_URL}/loans/${payment.loanId}/payments`;
    return this.http
      .post(url, {
        amount: Number(payment.amount),
        paidAt: payment.paidAt,
        note: payment.note || undefined,
      })
      .pipe(catchError(this.handleError));
  }

  editPayment(editPayment: EditPayment): Observable<unknown> {
    const url = `${API_BASE_URL}/loans/${editPayment.loanId}/payments/${editPayment.paymentId}`;
    return this.http
      .patch(url, {
        amount: Number(editPayment.amount),
        paidAt: editPayment.paidAt,
        note: editPayment.note || undefined,
      })
      .pipe(catchError(this.handleError));
  }
}

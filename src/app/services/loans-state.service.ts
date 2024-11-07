import { Injectable, inject } from '@angular/core'
import { LoansStore } from '@app/store'
import type { EditPayment, NewPayment } from '@app/models'

@Injectable()
export class LoansStateService {
  private store = inject(LoansStore)

  get loans() {
    return this.store.loans
  }

  updateLoans(): void {
    this.store.updateLoans()
  }

  addPayment(paymentData: NewPayment): void {
    this.store.addPayment(paymentData)
  }

  updatePayment(editData: EditPayment): void {
    this.store.updatePayment(editData)
  }
}
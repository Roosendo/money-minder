import { Injectable, inject, signal } from '@angular/core'
import { FormSubmitService } from '@app/services'
import type { EditPayment, NewPayment } from '@app/models'

@Injectable()
export class PaymentStateService {
  private submitService = inject(FormSubmitService)
  readonly editingPaymentId = signal<number | null>(null)

  addPayment(paymentData: NewPayment) {
    return this.submitService.addPayment(paymentData)
  }

  editPayment(editData: EditPayment) {
    return this.submitService.editPayment(editData)
  }

  toggleEditMode(paymentId: number): void {
    this.editingPaymentId.set(
      paymentId === this.editingPaymentId() ? null : paymentId
    )
  }

  cancelEdit(): void {
    this.editingPaymentId.set(null)
  }
}
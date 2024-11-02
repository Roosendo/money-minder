import { CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, type OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { SubmitBttnComponent } from '@app/core'
import type { Payments } from '@app/models'
import { LoansStore } from '@app/store/loans.store'

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, SubmitBttnComponent, DatePipe],
  templateUrl: './loans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoansComponent implements OnInit {
  private title = inject(Title)
  readonly store = inject(LoansStore)
  editingPaymentIds: { [paymentId: string]: boolean } = {}
  editPaymentDate = ''
  editPaymentAmount: number | null = null

  ngOnInit(): void {
    this.title.setTitle('Loans | Money Minder')
  }

  handleAddLoan(): void {
    alert('ola')
  }

  handleAddPayment(event: Event): void {
    event.preventDefault()
    alert('ola')
  }

  toggleEditMode(paymentId: number): void {
    this.editingPaymentIds[paymentId] = !this.editingPaymentIds[paymentId]
  }

  cancelEdit(paymentId: number): void {
    this.editingPaymentIds[paymentId] = false
    this.editPaymentDate = ''
    this.editPaymentAmount = null
  }

  confirmEditPayment(paymentId: number): void {
    const paymentIndex = this.store.loans().flatMap(loan => loan.last_five_payments).findIndex(payment => payment.id === paymentId)
    if (paymentIndex > -1) {
      
    }
    this.cancelEdit(paymentId)
  }
}

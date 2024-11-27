import { CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, type Signal, computed, inject } from '@angular/core'
import { type FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { SubmitBttnComponent } from '@app/core'
import type { EditPayment, Payments } from '@app/models'
import { AlertService, LoansFormService, LoansStateService, PaymentStateService, FormSubmitService } from '@app/services'

@Component({
    selector: 'app-loans',
    imports: [
        CurrencyPipe,
        DatePipe,
        ReactiveFormsModule,
        SubmitBttnComponent
    ],
    templateUrl: './loans.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        LoansFormService,
        LoansStateService,
        PaymentStateService
    ]
})
export class LoansComponent {
  private readonly titleService = inject(Title)
  private readonly loansForm = inject(LoansFormService)
  private readonly loansState = inject(LoansStateService)
  private readonly paymentState = inject(PaymentStateService)
  private readonly alertService = inject(AlertService)
  private readonly formSubmit = inject(FormSubmitService)

  readonly loans = this.loansState.loans
  readonly editingPaymentId = this.paymentState.editingPaymentId

  readonly addLoanForm: Signal<FormGroup> = computed(() => this.loansForm.createLoanForm())
  readonly editPaymentForm: Signal<FormGroup> = computed(() => this.loansForm.createEditForm())
  readonly addPaymentForm: Signal<FormGroup> = computed(() => this.loansForm.createPaymentForm())

  constructor() {
    this.titleService.setTitle('Loans | Money Minder')
  }

  handleAddLoan(): void {
    if (this.addLoanForm().invalid) return

    this.formSubmit.addLoan({
      loanTitle: this.addLoanForm().get('loanTitle')?.value,
      bankName: this.addLoanForm().get('bankName')?.value,
      interestRate: this.addLoanForm().get('interestRate')?.value,
      loanAmount: this.addLoanForm().get('loanAmount')?.value,
      loanStartDate: this.addLoanForm().get('loanStartDate')?.value,
      loanEndDate: this.addLoanForm().get('loanEndDate')?.value
    }).subscribe({
      next: (response) => {
        this.alertService.showSuccess({ feature: 'loan', action: 'create' })
        this.loansState.addLoan({
          id: response,
          bank_name: this.addLoanForm().get('bankName')?.value,
          interest_rate: this.addLoanForm().get('interestRate')?.value,
          last_five_payments: [],
          loan_amount: this.addLoanForm().get('loanAmount')?.value,
          loan_end_date: this.addLoanForm().get('loanEndDate')?.value,
          loan_start_date: this.addLoanForm().get('loanStartDate')?.value,
          loan_title: this.addLoanForm().get('loanTitle')?.value,
          total_payments: 0
        })
        this.loansForm.resetForm(this.addLoanForm())
      },
      error: () => this.alertService.showError({ feature: 'loan', action: 'create' })
    })
  }

  handleAddPayment(loanId: number): void {
    if (this.addPaymentForm().invalid) return

    const paymentData = this.loansForm.getPaymentFormData(this.addPaymentForm(), loanId)
    this.paymentState.addPayment(paymentData)
      .subscribe({
        next: () => {
          this.alertService.showSuccess({ feature: 'payment', action: 'create' })
          this.loansForm.resetForm(this.addPaymentForm())
          this.loansState.addPayment(paymentData)
        },
        error: () => this.alertService.showError({ feature: 'payment', action: 'create' })
      })
  }

  toggleEditMode(paymentId: number): void {
    this.paymentState.toggleEditMode(paymentId)
    const payment = this.findPayment(paymentId)
    if (payment) {
      this.loansForm.setEditFormValues(this.editPaymentForm(), payment)
    }
  }

  cancelEdit(): void {
    this.paymentState.cancelEdit()
    this.loansForm.resetForm(this.editPaymentForm())
  }

  confirmEditPayment(paymentId: number): void {
    if (this.editPaymentForm().invalid) return

    const editData: EditPayment = {
      paymentId,
      ...this.loansForm.getEditFormData(this.editPaymentForm())
    }

    this.paymentState.editPayment(editData)
      .subscribe({
        next: () => {
          this.alertService.showInfo({ feature: 'loan', action: 'update' })
          this.loansState.updatePayment(editData)
          this.cancelEdit()
        },
        error: () => this.alertService.showError({ feature: 'loan', action: 'update' })
      })
  }

  private findPayment(paymentId: number): Payments | undefined {
    return this.loans()
      .flatMap(loan => loan.last_five_payments)
      .find(payment => payment.id === paymentId)
  }
}

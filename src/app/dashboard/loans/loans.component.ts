import { CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, type OnInit, inject, signal, type Signal, computed, type WritableSignal } from '@angular/core'
import { FormControl, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { AlertMessageComponent, SubmitBttnComponent } from '@app/core'
import { FormSubmitService } from '@app/services'
import { LoansStore } from '@app/store/loans.store'
import { timer } from 'rxjs'
import type { TemplateLoanForm, TemplateEditForm, TemplateAddPaymentForm } from '@app/models'

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, SubmitBttnComponent, DatePipe, ReactiveFormsModule, AlertMessageComponent],
  templateUrl: './loans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoansComponent implements OnInit {
  private titleService = inject(Title)
  private submitService = inject(FormSubmitService)
  readonly store = inject(LoansStore)

  loans = this.store.loans
  editingPaymentId = signal<number | null>(null)
  
  am_success_payment = signal<boolean>(false)
  am_error_payment = signal<boolean>(false)
  am_success_loan = signal<boolean>(false)
  am_error_loan = signal<boolean>(false)

  addLoanForm: Signal<FormGroup> = computed(() => this.createLoanForm())
  editPaymentForm: Signal<FormGroup> = computed(() => this.createEditForm())
  addPaymentForm: Signal<FormGroup> = computed(() => this.createPaymentForm())

  ngOnInit(): void {
    this.titleService.setTitle('Loans | Money Minder')
  }

  private createLoanForm(): FormGroup<TemplateLoanForm> {
    return new FormGroup<TemplateLoanForm>({
      title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      bankName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      interestRate: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      startDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      endDate: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    })
  }

  private createEditForm(): FormGroup<TemplateEditForm> {
    return new FormGroup<TemplateEditForm>({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] })
    })
  }

  private createPaymentForm(): FormGroup<TemplateAddPaymentForm> {
    return new FormGroup<TemplateAddPaymentForm>({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] })
    })
  }

  handleAddLoan(): void {
    if (this.addLoanForm().invalid) return

    this.submitService.addLoan({
      loanTitle: this.addLoanForm().get('title')?.value,
      bankName: this.addLoanForm().get('bankName')?.value,
      interestRate: this.addLoanForm().get('interestRate')?.value,
      loanAmount: this.addLoanForm().get('amount')?.value,
      loanStartDate: this.addLoanForm().get('startDate')?.value,
      loanEndDate: this.addLoanForm().get('endDate')?.value
    }).subscribe({
      next: () => this.handleSuccess(this.am_success_loan, this.addLoanForm(), () => this.store.updateLoans()),
      error: () => this.handleError(this.am_error_loan)
    })
  }

  handleAddPayment(loanId: number): void {
    if (this.addPaymentForm().invalid) return

    const paymentData = {
      loanId,
      paymentAmount: this.addPaymentForm().get('amount')?.value,
      paymentDate: this.addPaymentForm().get('date')?.value
    }

    this.submitService.addPayment(paymentData).subscribe({
      next: () => this.handleSuccess(this.am_success_payment, this.addPaymentForm(), () => this.store.addPayment(paymentData)),
      error: () => this.handleError(this.am_error_payment)
    })
  }

  toggleEditMode(paymentId: number): void {
    this.editingPaymentId.set(paymentId === this.editingPaymentId() ? null : paymentId)
    const payment = this.store.loans().flatMap(loan => loan.last_five_payments).find(payment => payment.id === paymentId)
    if (payment) {
      this.editPaymentForm().setValue({ date: payment.payment_date, amount: payment.payment_amount })
    }
  }

  cancelEdit(): void {
    this.editingPaymentId.set(null)
    this.editPaymentForm().reset()
  }

  confirmEditPayment(paymentId: number): void {
    if (this.editPaymentForm().invalid) return

    const editData = {
      paymentId,
      paymentDate: this.editPaymentForm().get('date')?.value,
      paymentAmount: this.editPaymentForm().get('amount')?.value
    }

    this.submitService.editPayment(editData).subscribe({
      next: () => {
        this.store.updatePayment(editData)
        this.cancelEdit()
      },
      error: () => console.error('Error al editar el pago')
    })
  }

  private handleSuccess(flag: WritableSignal<boolean>, form: FormGroup, callback?: () => void): void {
    flag.set(true)
    timer(3500).subscribe(() => flag.set(false))
    form.reset()
    callback?.()
  }

  private handleError(flag: WritableSignal<boolean>): void {
    flag.set(true)
    timer(3500).subscribe(() => flag.set(false))
  }
}

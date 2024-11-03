import { CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, type OnInit, inject, signal, type Signal, computed } from '@angular/core'
import { FormControl, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { AlertMessageComponent, SubmitBttnComponent } from '@app/core'
import { FormSubmitService } from '@app/services'
import { LoansStore } from '@app/store/loans.store'
import { timer } from 'rxjs'

interface TemplateLoanForm {
  title: FormControl<string>
  bankName: FormControl<string>
  interestRate: FormControl<number>
  amount: FormControl<number>
  startDate: FormControl<string>
  endDate: FormControl<string>
}

interface TemplateEditForm {
  date: FormControl<string>
  amount: FormControl<number>
}

interface TemplateAddPaymentForm {
  date: FormControl<string>
  amount: FormControl<number>
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, SubmitBttnComponent, DatePipe, ReactiveFormsModule, AlertMessageComponent],
  templateUrl: './loans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoansComponent implements OnInit {
  private title = inject(Title)
  private submitService = inject(FormSubmitService)
  readonly store = inject(LoansStore)
  loans = this.store.loans
  editingPaymentId = signal<number | null>(null)
  am_success_payment = signal<boolean>(false)
  am_error_payment = signal<boolean>(false)
  am_success_loan = signal<boolean>(false)
  am_error_loan = signal<boolean>(false)

  ngOnInit(): void {
    this.title.setTitle('Loans | Money Minder')
  }

  addLoanForm: Signal<FormGroup> = computed(() =>
    new FormGroup<TemplateLoanForm>({
      title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      bankName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      interestRate: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      startDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      endDate: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    })
  )

  editPaymentForm: Signal<FormGroup> = computed(() =>
    new FormGroup<TemplateEditForm>({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] })
    })
  )

  addPaymentForm: Signal<FormGroup> = computed(() =>
    new FormGroup<TemplateAddPaymentForm>({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] })
    })
  )

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
      next: () => {
        this.am_success_loan.set(true)
        timer(3500).subscribe(() => this.am_success_loan.set(false))
        this.addLoanForm().reset()
        this.store.updateLoans()
      },
      error: () => {
        this.am_error_loan.set(true)
        timer(3500).subscribe(() => this.am_error_loan.set(false))
      }
    })
  }

  handleAddPayment(loanId: number): void {
    if (this.addPaymentForm().invalid) return
    this.submitService.addPayment({
      loanId,
      paymentAmount: this.addPaymentForm().get('amount')?.value,
      paymentDate: this.addPaymentForm().get('date')?.value
    }).subscribe({
      next: () => {
        this.am_success_payment.set(true)
        timer(3500).subscribe(() => this.am_success_payment.set(false))
        this.store.addPayment({
          loanId,
          paymentAmount: this.addPaymentForm().get('amount')?.value,
          paymentDate: this.addPaymentForm().get('date')?.value
        })
        this.addPaymentForm().reset()
      },
      error: () => {
        this.am_error_payment.set(true)
        timer(3500).subscribe(() => this.am_error_payment.set(false))
      }
    })
  }

  toggleEditMode(paymentId: number): void {
    if (paymentId !== this.editingPaymentId()) this.editingPaymentId.set(null)
    this.editingPaymentId.set(paymentId)
    this.editPaymentForm().setValue({
      date: this.store.loans().flatMap(loan => loan.last_five_payments).find(payment => payment.id === paymentId)?.payment_date ?? '',
      amount: this.store.loans().flatMap(loan => loan.last_five_payments).find(payment => payment.id === paymentId)?.payment_amount ?? 0
    })
  }

  cancelEdit(): void {
    this.editingPaymentId.set(null)
    this.editPaymentForm().reset()
  }

  confirmEditPayment(paymentId: number): void {
    if (this.editPaymentForm().invalid) return
    this.submitService.editPayment({ paymentId, paymentDate: this.editPaymentForm().get('date')?.value, paymentAmount: this.editPaymentForm().get('amount')?.value })
      .subscribe({
        next: () => {
          this.store.updatePayment({ paymentId, paymentDate: this.editPaymentForm().get('date')?.value, paymentAmount: this.editPaymentForm().get('amount')?.value })
          this.editPaymentForm().reset()
          this.cancelEdit()
        },
        error: () => console.error('Error al editar el pago')
      })
  }
}

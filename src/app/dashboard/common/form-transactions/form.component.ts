import {
  ChangeDetectionStrategy,
  Component,
  type Signal,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AlertMessageComponent, SubmitBttnComponent } from '@app/core'
import { AuthCacheService, FormSubmitService } from '@app/services'
import { CashFlowStore, CreditCardsStore, FinancialSummaryStore, TransactionsStore } from '@app/store'
import { timer } from 'rxjs'
import categoriesJson from './categories.json'

interface TemplateForm {
  date: FormControl<string>
  amount: FormControl<number>
  category: FormControl<string>
  description: FormControl<string>
  id: FormControl<number>
  email: FormControl<string | undefined>
  fullName: FormControl<string>
  isCreditPayment: FormControl<boolean>
  creditCardId: FormControl<string>
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AlertMessageComponent, SubmitBttnComponent]
})
export class FormComponent {
  formSubmitted = output<void>()
  type = input.required<'entries' | 'exits'>()
  categories = categoriesJson

  authCache = inject(AuthCacheService)
  formSubmit = inject(FormSubmitService)
  readonly transactionsStore = inject(TransactionsStore)
  readonly financialSummaryStore = inject(FinancialSummaryStore)
  readonly cashFlowStore = inject(CashFlowStore)
  readonly creditCardsStore = inject(CreditCardsStore)

  am_success = signal(false)
  am_category = signal(false)
  am_warning = signal(false)
  am_credit = signal(false)

  form: Signal<FormGroup> = computed(() =>
    new FormGroup<TemplateForm>({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl('', { nonNullable: true }),
      id: new FormControl(this.generateRandomId(), { nonNullable: true }),
      email: new FormControl(this.authCache.getUser()?.email, { nonNullable: true }),
      fullName: new FormControl(`${this.authCache.getUser()?.firstName} ${this.authCache.getUser()?.lastName}`, {
        nonNullable: true
      }),
      isCreditPayment: new FormControl(false, { nonNullable: true }),
      creditCardId: new FormControl('', { nonNullable: true })
    })
  )

  private generateRandomId() {
    return Math.floor(Math.random() * 1000000)
  }

  onSubmit() {
    if (this.form().invalid) {
      if (!this.form().get('category')?.value) {
        this.am_category.set(true)
        timer(3500).subscribe(() => this.am_category.set(false))
      }
      if (this.form().get('isCreditPayment')?.value && !this.form().get('creditCardId')?.value) {
        this.am_credit.set(true)
        timer(3500).subscribe(() => this.am_credit.set(false))
      }
      return
    }

    if (this.type() === 'entries') {
      this.submitEntriesForm()
    } else if (this.type() === 'exits') {
      this.submitExitsForm()
    }
  }

  private submitEntriesForm() {
    this.formSubmit.entrySubmit(this.form().value).subscribe({
      next: () => this.handleSuccess(),
      error: () => this.handleError()
    })
  }

  private submitExitsForm() {
    const formData = {
      ...this.form().value,
      creditCardId: (+this.form().value.creditCardId === 0 ? null : +this.form().value.creditCardId)
    }
    this.formSubmit.exitSubmit(formData).subscribe({
      next: () => this.handleSuccess(),
      error: () => this.handleError()
    })
  }

  private handleSuccess() {
    this.am_success.set(true)
    timer(3500).subscribe(() => this.am_success.set(false))
    const formData = this.form().value
    const currentYear = new Date().getFullYear()
    const formYear = new Date(formData.date).getFullYear()
    const formMonth = (new Date(formData.date).getMonth() + 1).toString().padStart(2, '0')

    if (this.type() === 'entries') {
      this.transactionsStore.addEntry(formData)
      this.transactionsStore.addRecentTransaction(formData)
      if (formYear === currentYear) {
        this.financialSummaryStore.addSummaryEntry(formData.amount)
        this.cashFlowStore.addEntryTransaction(formMonth, formData.amount)
      }
    } else {
      this.transactionsStore.addExit({ ...formData, is_credit_payment: formData.isCreditPayment ? 1 : 0 })
      this.transactionsStore.addRecentTransaction(formData)
      this.creditCardsStore.addPurchase(formData)
      if (formYear === currentYear) {
        this.financialSummaryStore.addSummaryExit(formData.amount)
        this.cashFlowStore.addExitTransaction(formMonth, formData.amount)
      }
    }
    this.form().reset()
    this.form().patchValue({
      id: this.generateRandomId(),
      email: this.authCache.getUser()?.email,
      fullName: `${this.authCache.getUser()?.firstName} ${this.authCache.getUser()?.lastName}`
    })
    this.formSubmitted.emit()
  }

  private handleError() {
    this.am_warning.set(true)
    timer(3500).subscribe(() => this.am_warning.set(false))
  }
}

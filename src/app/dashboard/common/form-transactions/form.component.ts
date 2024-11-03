import {
  ChangeDetectionStrategy,
  Component,
  type Signal,
  computed,
  inject,
  input,
  output,
  signal,
  type WritableSignal
} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AlertMessageComponent, SubmitBttnComponent } from '@app/core'
import { AuthCacheService, FormSubmitService } from '@app/services'
import { CashFlowStore, CreditCardsStore, FinancialSummaryStore, TransactionsStore } from '@app/store'
import { timer } from 'rxjs'
import categoriesJson from './categories.json'
import type { TemplateForm } from '@app/models'

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

  form: Signal<FormGroup> = computed(() => this.buildForm())

  private buildForm() {
    const user = this.authCache.getUser()
    return new FormGroup<TemplateForm>({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl('', { nonNullable: true }),
      id: new FormControl(this.generateRandomId(), { nonNullable: true }),
      email: new FormControl(user?.email, { nonNullable: true }),
      fullName: new FormControl(`${user?.firstName} ${user?.lastName}`, { nonNullable: true }),
      isCreditPayment: new FormControl(false, { nonNullable: true }),
      creditCardId: new FormControl('', { nonNullable: true })
    })
  }

  onSubmit() {
    if (this.form().invalid) {
      this.handleInvalidForm()
      return
    }
    this.type() === 'entries' ? this.submitForm('entry') : this.submitForm('exit')
  }

  private handleInvalidForm() {
    if (!this.form().get('category')?.value) this.toggleAlert(this.am_category)
    if (this.form().get('isCreditPayment')?.value && !this.form().get('creditCardId')?.value) {
      this.toggleAlert(this.am_credit)
    }
  }

  private submitForm(type: 'entry' | 'exit') {
    const formData = this.form().value
    const submitObservable = type === 'entry'
      ? this.formSubmit.entrySubmit(formData)
      : this.formSubmit.exitSubmit({ ...formData, creditCardId: this.parseCreditCardId(formData.creditCardId) })

    submitObservable.subscribe({
      next: () => this.handleSuccess(type),
      error: () => this.handleError()
    })
  }

  private handleSuccess(type: 'entry' | 'exit') {
    this.toggleAlert(this.am_success)
    this.updateStores(type)
    this.resetForm()
    this.formSubmitted.emit()
  }

  private handleError() {
    this.toggleAlert(this.am_warning)
  }

  private updateStores(type: 'entry' | 'exit') {
    const formData = this.form().value
    const currentYear = new Date().getFullYear()
    const formYear = new Date(formData.date).getFullYear()
    const formMonth = this.getMonthString(formData.date)

    if (type === 'entry') {
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
  }

  private resetForm() {
    this.form().reset()
    const user = this.authCache.getUser()
    this.form().patchValue({
      id: this.generateRandomId(),
      email: user?.email,
      fullName: `${user?.firstName} ${user?.lastName}`
    })
  }

  private toggleAlert(alertSignal: WritableSignal<boolean>) {
    alertSignal.set(true)
    timer(3500).subscribe(() => alertSignal.set(false))
  }

  private parseCreditCardId(creditCardId: string) {
    return +creditCardId === 0 ? null : +creditCardId
  }

  private getMonthString(date: string) {
    return (new Date(date).getMonth() + 1).toString().padStart(2, '0')
  }

  private generateRandomId() {
    return Math.floor(Math.random() * 1000000)
  }
}

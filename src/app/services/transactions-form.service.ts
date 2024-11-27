import { Injectable, inject, signal } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import type { TemplateForm } from '@app/models'
import { AlertService, AuthCacheService, FormSubmitService } from '@app/services'
import { CashFlowStore, CreditCardsStore, FinancialSummaryStore, TransactionsStore } from '@app/store'

@Injectable()
export class TransactionsFormService {
  private readonly formState = signal({
    type: 'entries'
  })
  private alertService = inject(AlertService)
  private authCache = inject(AuthCacheService)
  private formSubmit = inject(FormSubmitService)
  private cashFlowStore = inject(CashFlowStore)
  private creditCards = inject(CreditCardsStore)
  private financialSummary = inject(FinancialSummaryStore)
  private transactions = inject(TransactionsStore)
  private user = this.authCache.getUser()

  initializeForm(type: 'entries' | 'exits'): FormGroup {
    this.formState.set({ type })
  
    return new FormGroup({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(
        type === 'entries' ? 0 : -99999999
      )] }),
      category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl('', { nonNullable: true }),
      id: new FormControl(this.generateRandomId(), { nonNullable: true }),
      email: new FormControl(this.user?.email, { nonNullable: true }),
      fullName: new FormControl(`${this.user?.firstName} ${this.user?.lastName}`, { nonNullable: true }),
      isCreditPayment: new FormControl(false, { nonNullable: true }),
      creditCardId: new FormControl('', { nonNullable: true })
    })
  }

  async handleSubmit(formData: TemplateForm): Promise<void> {
    try {
      if (this.formState().type === 'entries') {

      }
    } catch (_error) {
      this.alertService.showError({ feature: 'entry', action: 'create' })
    }
  }

  resetForm(form: FormGroup): void {
    form.reset()
    const user = this.authCache.getUser()
    form.patchValue({
      id: this.generateRandomId(),
      email: user?.email,
      fullName: `${user?.firstName} ${user?.lastName}`
    })
  }

  private async handleEntrySubmission(formData: TemplateForm): Promise<void> {
    
  }

  private generateRandomId() {
    return Math.floor(Math.random() * 1000000)
  }
}

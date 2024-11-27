import type { WritableSignal } from '@angular/core'
import type { FormControl } from '@angular/forms'

export interface TemplateLoanForm {
	loanTitle: FormControl<string>
	bankName: FormControl<string>
	interestRate: FormControl<number>
	loanAmount: FormControl<number>
	loanStartDate: FormControl<string>
	loanEndDate: FormControl<string>
}

export interface TemplateEditForm {
	date: FormControl<string>
	amount: FormControl<number>
}

export interface TemplateAddPaymentForm {
	date: FormControl<string>
	amount: FormControl<number>
}

export interface AlertState {
  loan: {
    success: WritableSignal<boolean>
    error: WritableSignal<boolean>
  }
  payment: {
    success: WritableSignal<boolean>
    error: WritableSignal<boolean>
  }
}
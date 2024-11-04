import type { WritableSignal } from '@angular/core'
import type { FormControl } from '@angular/forms'

export interface TemplateLoanForm {
	title: FormControl<string>
	bankName: FormControl<string>
	interestRate: FormControl<number>
	amount: FormControl<number>
	startDate: FormControl<string>
	endDate: FormControl<string>
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
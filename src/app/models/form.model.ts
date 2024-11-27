import type { FormControl } from '@angular/forms'

export interface TemplateForm {
  date: FormControl<string>
  amount: FormControl<number>
  category: FormControl<string>
  description: FormControl<string>
  email: FormControl<string | undefined>
  fullName: FormControl<string>
  isCreditPayment: FormControl<boolean>
  creditCardId: FormControl<string>
}

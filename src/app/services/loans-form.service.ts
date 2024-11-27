import { Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import type { NewLoan, NewPayment, Payments, TemplateAddPaymentForm, TemplateEditForm, TemplateLoanForm } from '@app/models'

@Injectable()
export class LoansFormService {
  createLoanForm(): FormGroup<TemplateLoanForm> {
    return new FormGroup<TemplateLoanForm>({
      loanTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      bankName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      interestRate: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      loanAmount: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      loanStartDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      loanEndDate: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    })
  }

  createEditForm(): FormGroup<TemplateEditForm> {
    return new FormGroup<TemplateEditForm>({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] })
    })
  }

  createPaymentForm(): FormGroup<TemplateAddPaymentForm> {
    return new FormGroup<TemplateAddPaymentForm>({
      date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] })
    })
  }

  getLoanFormData(form: FormGroup): NewLoan {
    return {
      loanTitle: form.get('title')?.value,
      bankName: form.get('bankName')?.value,
      interestRate: form.get('interestRate')?.value,
      loanAmount: form.get('amount')?.value,
      loanStartDate: form.get('startDate')?.value,
      loanEndDate: form.get('endDate')?.value
    }
  }

  getPaymentFormData(form: FormGroup, loanId: number): NewPayment {
    return {
      loanId,
      paymentAmount: form.get('amount')?.value,
      paymentDate: form.get('date')?.value
    }
  }

  getEditFormData(form: FormGroup): Omit<NewPayment, 'loanId'> {
    return {
      paymentDate: form.get('date')?.value,
      paymentAmount: form.get('amount')?.value
    }
  }

  setEditFormValues(form: FormGroup, payment: Payments): void {
    form.setValue({
      date: payment.payment_date,
      amount: payment.payment_amount
    })
  }

  resetForm(form: FormGroup): void {
    form.reset()
  }
}

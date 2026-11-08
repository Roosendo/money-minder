import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import type {
  EditPayment,
  LoanDirection,
  NewLoan,
  NewPayment,
  Payments,
  TemplateAddPaymentForm,
  TemplateEditForm,
  TemplateLoanForm,
} from "@app/models";

@Injectable()
export class LoansFormService {
  createLoanForm(): FormGroup<TemplateLoanForm> {
    return new FormGroup<TemplateLoanForm>({
      name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
      direction: new FormControl<LoanDirection>("borrowed", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      principal: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      interestRate: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      startDate: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
      dueDate: new FormControl("", { nonNullable: true }),
    });
  }

  createEditForm(): FormGroup<TemplateEditForm> {
    return new FormGroup<TemplateEditForm>({
      paidAt: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      note: new FormControl("", { nonNullable: true }),
    });
  }

  createPaymentForm(): FormGroup<TemplateAddPaymentForm> {
    return new FormGroup<TemplateAddPaymentForm>({
      paidAt: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      note: new FormControl("", { nonNullable: true }),
    });
  }

  getLoanFormData(form: FormGroup): NewLoan {
    return {
      name: form.get("name")?.value,
      direction: form.get("direction")?.value,
      principal: form.get("principal")?.value,
      interestRate: form.get("interestRate")?.value,
      startDate: form.get("startDate")?.value,
      dueDate: form.get("dueDate")?.value || undefined,
    };
  }

  getPaymentFormData(form: FormGroup, loanId: string): NewPayment {
    return {
      loanId,
      amount: form.get("amount")?.value,
      paidAt: form.get("paidAt")?.value,
      note: form.get("note")?.value || undefined,
    };
  }

  getEditFormData(form: FormGroup): Omit<EditPayment, "loanId" | "paymentId"> {
    return {
      amount: form.get("amount")?.value,
      paidAt: form.get("paidAt")?.value,
      note: form.get("note")?.value || undefined,
    };
  }

  setEditFormValues(form: FormGroup, payment: Payments): void {
    form.setValue({
      paidAt: payment.paidAt.slice(0, 10),
      amount: payment.amount,
      note: payment.note ?? "",
    });
  }

  resetForm(form: FormGroup): void {
    form.reset();
  }
}

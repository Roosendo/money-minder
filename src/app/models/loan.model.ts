import type { WritableSignal } from "@angular/core";
import type { FormControl } from "@angular/forms";
import type { LoanDirection } from "./dashboard.model";

export interface TemplateLoanForm {
  name: FormControl<string>;
  direction: FormControl<LoanDirection>;
  principal: FormControl<number>;
  interestRate: FormControl<number>;
  startDate: FormControl<string>;
  dueDate: FormControl<string>;
}

export interface TemplateEditForm {
  paidAt: FormControl<string>;
  amount: FormControl<number>;
  note: FormControl<string>;
}

export interface TemplateAddPaymentForm {
  paidAt: FormControl<string>;
  amount: FormControl<number>;
  note: FormControl<string>;
}

export interface AlertState {
  loan: {
    success: WritableSignal<boolean>;
    error: WritableSignal<boolean>;
  };
  payment: {
    success: WritableSignal<boolean>;
    error: WritableSignal<boolean>;
  };
}

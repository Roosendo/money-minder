import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, type Signal, computed, inject } from "@angular/core";
import { type FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { SubmitBttnComponent } from "@app/core";
import type { EditPayment, LoanDirection, Payments } from "@app/models";
import {
  AlertService,
  LoansFormService,
  LoansStateService,
  PaymentStateService,
  FormSubmitService,
} from "@app/services";

@Component({
  selector: "app-loans",
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, SubmitBttnComponent],
  templateUrl: "./loans.component.html",
  providers: [LoansFormService, LoansStateService, PaymentStateService],
})
export class LoansComponent {
  private readonly titleService = inject(Title);
  private readonly loansForm = inject(LoansFormService);
  private readonly loansState = inject(LoansStateService);
  private readonly paymentState = inject(PaymentStateService);
  private readonly alertService = inject(AlertService);
  private readonly formSubmit = inject(FormSubmitService);

  readonly loans = this.loansState.loans;
  readonly editingPaymentId = this.paymentState.editingPaymentId;

  readonly addLoanForm: Signal<FormGroup> = computed(() => this.loansForm.createLoanForm());
  readonly editPaymentForm: Signal<FormGroup> = computed(() => this.loansForm.createEditForm());
  readonly addPaymentForm: Signal<FormGroup> = computed(() => this.loansForm.createPaymentForm());

  constructor() {
    this.titleService.setTitle("Loans | Money Minder");
  }

  directionLabel(direction: LoanDirection): string {
    return direction === "lent" ? "Prestado a alguien" : "Dinero prestado a mí";
  }

  handleAddLoan(): void {
    if (this.addLoanForm().invalid) return;

    this.formSubmit.addLoan(this.loansForm.getLoanFormData(this.addLoanForm())).subscribe({
      next: () => {
        this.alertService.showSuccess({ feature: "loan", action: "create" });
        // The create endpoint returns the raw record; refetch so the list has
        // the computed totals and payments.
        this.loansState.updateLoans();
        this.loansForm.resetForm(this.addLoanForm());
      },
      error: () => this.alertService.showError({ feature: "loan", action: "create" }),
    });
  }

  handleAddPayment(loanId: string): void {
    if (this.addPaymentForm().invalid) return;

    const paymentData = this.loansForm.getPaymentFormData(this.addPaymentForm(), loanId);
    this.paymentState.addPayment(paymentData).subscribe({
      next: () => {
        this.alertService.showSuccess({ feature: "payment", action: "create" });
        this.loansForm.resetForm(this.addPaymentForm());
        this.loansState.addPayment(paymentData);
      },
      error: () => this.alertService.showError({ feature: "payment", action: "create" }),
    });
  }

  toggleEditMode(paymentId: string): void {
    this.paymentState.toggleEditMode(paymentId);
    const payment = this.findPayment(paymentId);
    if (payment) {
      this.loansForm.setEditFormValues(this.editPaymentForm(), payment);
    }
  }

  cancelEdit(): void {
    this.paymentState.cancelEdit();
    this.loansForm.resetForm(this.editPaymentForm());
  }

  confirmEditPayment(loanId: string, paymentId: string): void {
    if (this.editPaymentForm().invalid) return;

    const editData: EditPayment = {
      loanId,
      paymentId,
      ...this.loansForm.getEditFormData(this.editPaymentForm()),
    };

    this.paymentState.editPayment(editData).subscribe({
      next: () => {
        this.alertService.showInfo({ feature: "loan", action: "update" });
        this.loansState.updatePayment(editData);
        this.cancelEdit();
      },
      error: () => this.alertService.showError({ feature: "loan", action: "update" }),
    });
  }

  private findPayment(paymentId: string): Payments | undefined {
    return this.loans()
      .flatMap((loan) => loan.lastFivePayments)
      .find((payment) => payment.id === paymentId);
  }
}

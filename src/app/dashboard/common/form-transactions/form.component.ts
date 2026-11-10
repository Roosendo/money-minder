import { Component, type Signal, computed, inject, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SubmitBttnComponent } from "@app/core";
import type { TemplateForm } from "@app/models";
import { AlertService, FormSubmitService } from "@app/services";
import {
  CashFlowStore,
  CreditCardsStore,
  FinancialSummaryStore,
  TransactionsStore,
} from "@app/store";
import categoriesJson from "./categories.json";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  imports: [ReactiveFormsModule, SubmitBttnComponent],
})
export class FormComponent {
  formSubmitted = output<void>();
  type = input.required<"entries" | "exits">();
  categories = categoriesJson;

  formSubmit = inject(FormSubmitService);
  readonly transactionsStore = inject(TransactionsStore);
  readonly financialSummaryStore = inject(FinancialSummaryStore);
  readonly cashFlowStore = inject(CashFlowStore);
  readonly creditCardsStore = inject(CreditCardsStore);
  readonly alertService = inject(AlertService);

  form: Signal<FormGroup> = computed(() => this.buildForm());

  private buildForm() {
    return new FormGroup<TemplateForm>({
      date: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      category: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl("", { nonNullable: true }),
      isCreditPayment: new FormControl(false, { nonNullable: true }),
      creditCardId: new FormControl("", { nonNullable: true }),
    });
  }

  onSubmit() {
    if (this.form().invalid) {
      this.handleInvalidForm();
      return;
    }
    this.submitForm(this.type() === "entries" ? "entry" : "exit");
  }

  private handleInvalidForm() {
    if (!this.form().get("category")?.value) {
      this.showCategoryAlert();
    }
    if (
      this.type() === "exits" &&
      this.form().get("isCreditPayment")?.value &&
      !this.form().get("creditCardId")?.value
    ) {
      this.showCreditCardAlert();
    }
  }

  private showCategoryAlert() {
    this.alertService.showWarning({
      feature: this.type() === "entries" ? "entry" : "exit",
      action: "create",
      customMessage: "Tienes que agregar una categoría",
    });
  }

  private showCreditCardAlert() {
    this.alertService.showInfo({
      feature: "exit",
      action: "create",
      customMessage: "Antes debes agregar una Tarjeta de Crédito",
    });
  }

  private submitForm(type: "entry" | "exit") {
    const formData = this.form().value;
    const submitObservable =
      type === "entry"
        ? this.formSubmit.entrySubmit({
            amount: formData.amount,
            category: formData.category,
            date: formData.date,
            description: formData.description,
          })
        : this.formSubmit.exitSubmit({
            amount: formData.amount,
            category: formData.category,
            date: formData.date,
            description: formData.description,
            creditCardId: formData.isCreditPayment ? formData.creditCardId || null : null,
          });

    submitObservable.subscribe({
      next: (newResourceId) => this.handleSuccess(type, newResourceId),
      error: () => this.handleError(),
    });
  }

  private handleSuccess(type: "entry" | "exit", resourceId: string) {
    this.alertService.showSuccess({
      feature: this.type() === "entries" ? "entry" : "exit",
      action: "create",
    });
    this.updateStores(type, resourceId);
    this.resetForm();
    this.formSubmitted.emit();
  }

  private handleError() {
    this.alertService.showError({
      feature: this.type() === "entries" ? "entry" : "exit",
      action: "fetch",
    });
  }

  private updateStores(type: "entry" | "exit", resourceId: string) {
    const formData = this.form().value;
    const currentYear = new Date().getFullYear();
    const formYear = new Date(formData.date).getFullYear();
    const formMonth = this.getMonthString(formData.date);

    if (type === "entry") {
      this.transactionsStore.addEntry({
        id: resourceId,
        amount: formData.amount,
        category: formData.category,
        date: formData.date,
        description: formData.description,
      });
      this.transactionsStore.addRecentTransaction({
        id: resourceId,
        type: "income",
        amount: formData.amount,
        category: formData.category,
        date: formData.date,
        description: formData.description,
      });
      if (formYear === currentYear) {
        this.financialSummaryStore.addSummaryEntry(formData.amount);
        this.cashFlowStore.addEntryTransaction(formMonth, formData.amount);
      }
      return;
    }

    const creditCardId = formData.isCreditPayment ? formData.creditCardId || null : null;

    this.transactionsStore.addExit({
      id: resourceId,
      amount: formData.amount,
      category: formData.category,
      date: formData.date,
      description: formData.description,
      credit_card_id: creditCardId,
      isCredit: creditCardId ? 1 : 0,
    });
    this.transactionsStore.addRecentTransaction({
      id: resourceId,
      type: "expense",
      amount: formData.amount,
      category: formData.category,
      date: formData.date,
      description: formData.description,
    });
    if (creditCardId) {
      void this.creditCardsStore.updatePurchases();
      void this.creditCardsStore.updateCardTransactions();
    }
    if (formYear === currentYear) {
      this.financialSummaryStore.addSummaryExit(formData.amount);
      this.cashFlowStore.addExitTransaction(formMonth, formData.amount);
    }
  }

  private resetForm() {
    this.form().reset({
      date: "",
      amount: 0,
      category: "",
      description: "",
      isCreditPayment: false,
      creditCardId: "",
    });
  }

  private getMonthString(date: string) {
    return (new Date(date).getMonth() + 1).toString().padStart(2, "0");
  }
}

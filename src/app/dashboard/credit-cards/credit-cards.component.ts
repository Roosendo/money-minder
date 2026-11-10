import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { SubmitBttnComponent } from "@app/core";
import type { CreditCards, Purchases, Transaction } from "@app/models";
import { AlertService, FormSubmitService } from "@app/services";
import { CreditCardsStore } from "@app/store";
import { extractApiErrorMessage } from "@app/utils";
import { ModalDeleteCcComponent } from "./modal-delete-cc";

interface TemplateFormCC {
  name: FormControl<string>;
  last4: FormControl<string>;
  creditLimit: FormControl<number>;
  statementDay: FormControl<number>;
  dueDay: FormControl<number>;
}

@Component({
  selector: "app-credit-cards",
  imports: [
    ReactiveFormsModule,
    SubmitBttnComponent,
    DatePipe,
    CurrencyPipe,
    ModalDeleteCcComponent,
  ],
  templateUrl: "./credit-cards.component.html",
})
export class CreditCardsComponent {
  private readonly formSubmit = inject(FormSubmitService);
  private readonly title = inject(Title);
  readonly store = inject(CreditCardsStore);
  readonly alertService = inject(AlertService);

  readonly creditCards = this.store.creditCards;
  readonly purchases = this.store.purchases;
  readonly cardTransactions = this.store.cardTransactions;
  readonly currentMonth = new Date().getMonth() + 1;
  readonly currentYear = new Date().getFullYear();
  readonly selectedCard = signal<CreditCards | null>(null);
  readonly modalDelete = signal(false);
  readonly expandedCard = signal<string | null>(null);
  readonly days = Array.from({ length: 31 }, (_, index) => index + 1);

  readonly formData = new FormGroup<TemplateFormCC>({
    name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    last4: new FormControl("", {
      nonNullable: true,
      validators: [Validators.pattern(/^\d{4}$/)],
    }),
    creditLimit: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    statementDay: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    dueDay: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  constructor() {
    this.title.setTitle("Tarjetas de crédito | Money Minder");
  }

  toggleCardExpansion(cardId: string): void {
    this.expandedCard.update((expanded) => (expanded === cardId ? null : cardId));
  }

  getPurchasesForCard(cardId: string): Purchases | undefined {
    return this.purchases().find((purchase) => purchase.id === cardId);
  }

  getTransactionsForCard(cardId: string): Transaction[] {
    return this.cardTransactions().filter((transaction) => transaction.credit_card_id === cardId);
  }

  openModalDelete(card: CreditCards): void {
    this.selectedCard.set(card);
    this.modalDelete.set(true);
  }

  closeModalDelete(): void {
    this.modalDelete.set(false);
    this.selectedCard.set(null);
  }

  deleteCard(id: string): void {
    this.formSubmit.deleteCreditCard(id).subscribe({
      next: () => {
        this.store.deleteCreditCard(id);
        this.closeModalDelete();
      },
      error: (error: unknown) => {
        this.handleError(error, "delete", "No se pudo eliminar la tarjeta.");
        this.closeModalDelete();
      },
    });
  }

  onSubmit(): void {
    if (this.formData.invalid) {
      this.handleInvalidForm();
      return;
    }

    const values = this.formData.getRawValue();

    this.formSubmit
      .creditCardSubmit({
        name: values.name,
        last4: values.last4 || undefined,
        creditLimit: values.creditLimit,
        statementDay: values.statementDay,
        dueDay: values.dueDay,
      })
      .subscribe({
        next: (card) => {
          this.alertService.showSuccess({ feature: "creditCard", action: "create" });
          this.store.addCreditCard(card);
          void this.store.updatePurchases();
          this.formData.reset({
            name: "",
            last4: "",
            creditLimit: 0,
            statementDay: 0,
            dueDay: 0,
          });
        },
        error: (error: unknown) => this.handleError(error, "create"),
      });
  }

  private handleInvalidForm(): void {
    if (!this.formData.controls.name.value) {
      this.showWarning("Antes debes agregar un nombre");
      return;
    }

    if (this.formData.controls.last4.invalid) {
      this.showWarning("Los últimos 4 dígitos deben ser exactamente 4 números");
      return;
    }

    if (this.formData.controls.creditLimit.invalid) {
      this.showWarning("El límite de crédito debe ser 0 o mayor");
      return;
    }

    if (this.formData.controls.statementDay.invalid) {
      this.showWarning("Antes debes agregar una fecha de corte");
      return;
    }

    if (this.formData.controls.dueDay.invalid) {
      this.showWarning("Antes debes agregar una fecha de pago");
      return;
    }

    this.showWarning("Revisa los datos de la tarjeta");
  }

  private showWarning(customMessage: string): void {
    this.alertService.showWarning({ feature: "creditCard", action: "create", customMessage });
  }

  private handleError(error: unknown, action: "create" | "delete", fallback?: string): void {
    this.alertService.showError({
      feature: "creditCard",
      action,
      customMessage: fallback ? extractApiErrorMessage(error, fallback) : undefined,
    });
  }
}

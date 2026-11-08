import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, type Signal, computed, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { SubmitBttnComponent } from "@app/core";
import type { CreditCards, Purchases, Transaction } from "@app/models";
import { AlertService, FormSubmitService } from "@app/services";
import { CreditCardsStore } from "@app/store";
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
    CommonModule,
    ModalDeleteCcComponent,
  ],
  templateUrl: "./credit-cards.component.html",
})
export class CreditCardsComponent {
  private formSubmit = inject(FormSubmitService);
  private title = inject(Title);
  readonly store = inject(CreditCardsStore);
  readonly alertService = inject(AlertService);
  creditCards = this.store.creditCards;
  purchases = this.store.purchases;
  cardTransactions = this.store.cardTransactions;
  currentMonth = computed(() => new Date().getMonth() + 1);
  currentYear = computed(() => new Date().getFullYear());
  total = computed(() => this.purchases().reduce((acc, purchase) => acc + purchase.totalSpent, 0));
  selectedCard: CreditCards | null = null;
  modalDelete = signal(false);

  constructor() {
    this.title.setTitle("Credit Cards | Money Minder");
  }

  formData: Signal<FormGroup> = computed(
    () =>
      new FormGroup<TemplateFormCC>({
        name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        last4: new FormControl("", {
          nonNullable: true,
          validators: [Validators.pattern(/^\d{4}$/)],
        }),
        creditLimit: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
        statementDay: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
        dueDay: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      }),
  );

  days = Array.from({ length: 31 }, (_, i) => i + 1);

  expandedCard: string | null = null;
  toggleCardExpansion(cardId: string): void {
    this.expandedCard = this.expandedCard === cardId ? null : cardId;
  }

  getPurchasesForCard(cardId: string): Purchases | undefined {
    return this.purchases().find((p) => p.id === cardId);
  }

  getTransactionsForCard(cardId: string): Transaction[] {
    return this.cardTransactions().filter((t) => t.credit_card_id === cardId);
  }

  openModalDelete(card: CreditCards): void {
    this.selectedCard = card;
    this.modalDelete.set(true);
  }

  closeModalDelete(): void {
    this.modalDelete.set(false);
    this.selectedCard = null;
  }

  deleteCard(id: string): void {
    this.formSubmit.deleteCreditCard(id).subscribe({
      next: () => {
        this.store.deleteCreditCard(id);
        this.closeModalDelete();
      },
      error: () => {
        this.handleError();
        this.closeModalDelete();
      },
    });
  }

  onSubmit(): void {
    if (this.formData().invalid) {
      if (!this.formData().get("name")?.value) {
        this.alertService.showWarning({
          feature: "creditCard",
          action: "create",
          customMessage: "Antes debes agregar un nombre",
        });
      }
      if (!this.formData().get("creditLimit")?.value) {
        this.alertService.showWarning({
          feature: "creditCard",
          action: "create",
          customMessage: "Antes debes agregar un límite de crédito",
        });
      }
      if (!this.formData().get("statementDay")?.value) {
        this.alertService.showWarning({
          feature: "creditCard",
          action: "create",
          customMessage: "Antes debes agregar una fecha de corte",
        });
      }
      if (!this.formData().get("dueDay")?.value) {
        this.alertService.showWarning({
          feature: "creditCard",
          action: "create",
          customMessage: "Antes debes agregar una fecha de pago",
        });
      }
      return;
    }

    const last4 = this.formData().get("last4")?.value;

    this.formSubmit
      .creditCardSubmit({
        name: this.formData().get("name")?.value,
        last4: last4 || undefined,
        creditLimit: this.formData().get("creditLimit")?.value,
        statementDay: this.formData().get("statementDay")?.value,
        dueDay: this.formData().get("dueDay")?.value,
      })
      .subscribe({
        next: (card) => {
          this.alertService.showSuccess({ feature: "creditCard", action: "create" });
          this.store.addCreditCard(card);
          void this.store.updatePurchases();
          this.formData().reset({
            name: "",
            last4: "",
            creditLimit: 0,
            statementDay: 0,
            dueDay: 0,
          });
        },
        error: () => this.handleError(),
      });
  }

  private handleError(): void {
    this.alertService.showError({ feature: "creditCard", action: "create" });
  }
}

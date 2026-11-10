import { CurrencyPipe, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";

import { SubmitBttnComponent } from "@app/core";
import type { AccountType } from "@app/models";
import { AlertService, FormSubmitService } from "@app/services";
import {
  AccountsStore,
  CashFlowStore,
  CreditCardsStore,
  FinancialSummaryStore,
  TransactionsStore,
  TransfersStore,
} from "@app/store";
import {
  extractApiErrorMessage,
  isValidNonNegativeMoney,
  isValidPositiveMoney,
  toMoney,
} from "@app/utils";

interface TransferForm {
  fromAccountId: FormControl<string>;
  toAccountId: FormControl<string>;
  amount: FormControl<number>;
  fee: FormControl<number>;
  date: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: "app-transfers",
  imports: [ReactiveFormsModule, SubmitBttnComponent, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: "./transfers.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersComponent {
  private readonly formSubmit = inject(FormSubmitService);
  private readonly title = inject(Title);
  private readonly accountsStore = inject(AccountsStore);
  private readonly creditCardsStore = inject(CreditCardsStore);
  private readonly transactionsStore = inject(TransactionsStore);
  private readonly financialSummaryStore = inject(FinancialSummaryStore);
  private readonly cashFlowStore = inject(CashFlowStore);
  readonly store = inject(TransfersStore);
  readonly alertService = inject(AlertService);

  readonly transfers = this.store.transfers;
  readonly page = this.store.page;
  readonly totalPages = this.store.totalPages;
  readonly loading = signal(false);

  readonly accounts = computed(() =>
    this.accountsStore.accounts().filter((account) => account.isActive),
  );

  /** Credit cards cannot be the source of a transfer. */
  readonly sourceAccounts = computed(() =>
    this.accounts().filter((account) => account.type !== "credit_card"),
  );

  readonly destinationAccounts = computed(() => this.accounts());

  readonly formData = this.buildForm();

  constructor() {
    this.title.setTitle("Transferencias | Money Minder");
  }

  private buildForm() {
    return new FormGroup<TransferForm>({
      fromAccountId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      toAccountId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      fee: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.min(0)],
      }),
      date: new FormControl(this.localToday(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl("", { nonNullable: true }),
    });
  }

  accountName(id: string, fallback: string | null): string {
    return fallback || this.accounts().find((account) => account.id === id)?.name || "—";
  }

  accountTypeLabel(type: AccountType): string {
    switch (type) {
      case "cash":
        return "Efectivo";
      case "savings":
        return "Ahorros";
      case "credit_card":
        return "Tarjeta de crédito";
      default:
        return "Banco";
    }
  }

  async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPages() || this.loading()) return;

    this.loading.set(true);

    try {
      await this.store.loadPage(page);
    } catch (error) {
      this.showError(error, "No se pudieron cargar las transferencias.");
    } finally {
      this.loading.set(false);
    }
  }

  onSubmit(): void {
    if (this.formData.invalid) {
      this.handleInvalidForm();
      return;
    }

    const values = this.formData.getRawValue();

    if (values.fromAccountId === values.toAccountId) {
      this.showWarning("La cuenta de origen y destino deben ser diferentes");
      return;
    }

    if (!isValidPositiveMoney(values.amount)) {
      this.showWarning("El monto debe ser mayor a 0 y tener máximo dos decimales");
      return;
    }

    if (!isValidNonNegativeMoney(values.fee)) {
      this.showWarning("La comisión no puede ser negativa y admite máximo dos decimales");
      return;
    }

    this.formSubmit
      .transferSubmit({
        fromAccountId: values.fromAccountId,
        toAccountId: values.toAccountId,
        amount: toMoney(values.amount),
        fee: toMoney(values.fee),
        description: values.description || undefined,
        occurredAt: values.date,
      })
      .subscribe({
        next: () => {
          this.alertService.showSuccess({ feature: "transfer", action: "create" });
          this.resetForm();
          void this.refreshData();
        },
        error: (error: unknown) => this.showError(error, "No se pudo realizar la transferencia."),
      });
  }

  private handleInvalidForm(): void {
    if (!this.formData.get("fromAccountId")?.value) {
      this.showWarning("Selecciona la cuenta de origen");
      return;
    }

    if (!this.formData.get("toAccountId")?.value) {
      this.showWarning("Selecciona la cuenta de destino");
      return;
    }

    if (!isValidPositiveMoney(this.formData.get("amount")?.value)) {
      this.showWarning("El monto debe ser mayor a 0 y tener máximo dos decimales");
      return;
    }

    if (!this.formData.get("date")?.value) {
      this.showWarning("Selecciona la fecha de la transferencia");
      return;
    }

    this.showWarning("Revisa los datos de la transferencia");
  }

  private async refreshData(): Promise<void> {
    const results = await Promise.allSettled([
      this.store.refresh(),
      this.accountsStore.refresh(),
      this.creditCardsStore.refresh(),
      this.transactionsStore.refresh(),
      this.financialSummaryStore.updateFinancialSummary(),
      this.cashFlowStore.updateCashFlow(),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Error refreshing data after transfer:", result.reason);
      }
    }
  }

  private showWarning(customMessage: string): void {
    this.alertService.showWarning({ feature: "transfer", action: "create", customMessage });
  }

  private showError(error: unknown, fallback: string): void {
    this.alertService.showError({
      feature: "transfer",
      action: "create",
      customMessage: extractApiErrorMessage(error, fallback),
    });
  }

  private resetForm(): void {
    this.formData.reset({
      fromAccountId: "",
      toAccountId: "",
      amount: 0,
      fee: 0,
      date: this.localToday(),
      description: "",
    });
  }

  private localToday(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
  }
}

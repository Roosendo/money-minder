import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, HostListener, computed, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";

import { SubmitBttnComponent } from "@app/core";
import type { AccountType, ApiAccount, WritableAccountType } from "@app/models";
import { AlertService, FormSubmitService } from "@app/services";
import { AccountsStore } from "@app/store";
import { extractApiErrorMessage, isValidNonNegativeMoney, toMoney } from "@app/utils";

interface AccountForm {
  name: FormControl<string>;
  type: FormControl<WritableAccountType>;
  openingBalance: FormControl<number>;
  openingBalanceDate: FormControl<string>;
}

@Component({
  selector: "app-accounts",
  imports: [ReactiveFormsModule, SubmitBttnComponent, CurrencyPipe, RouterLink, DatePipe],
  templateUrl: "./accounts.component.html",
})
export class AccountsComponent {
  private readonly formSubmit = inject(FormSubmitService);
  private readonly title = inject(Title);
  readonly store = inject(AccountsStore);
  readonly alertService = inject(AlertService);

  /** Credit cards have their own page and metadata, so they are not listed here. */
  readonly accounts = computed(() =>
    this.store.accounts().filter((account) => account.type !== "credit_card"),
  );
  readonly archiveTarget = signal<ApiAccount | null>(null);

  readonly accountTypes: Array<{ value: WritableAccountType; label: string }> = [
    { value: "bank", label: "Banco" },
    { value: "cash", label: "Efectivo" },
    { value: "savings", label: "Ahorros" },
  ];

  readonly formData = this.buildForm();

  constructor() {
    this.title.setTitle("Cuentas | Money Minder");
  }

  private buildForm() {
    return new FormGroup<AccountForm>({
      name: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      type: new FormControl<WritableAccountType>("bank", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      openingBalance: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      openingBalanceDate: new FormControl(this.localToday(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onSubmit(): void {
    if (this.formData.invalid) {
      this.handleInvalidForm();
      return;
    }

    const values = this.formData.getRawValue();

    if (!isValidNonNegativeMoney(values.openingBalance)) {
      this.showWarning("El saldo inicial no puede ser negativo y admite máximo dos decimales");
      return;
    }

    this.formSubmit
      .accountSubmit({
        name: values.name.trim(),
        type: values.type,
        openingBalance: toMoney(values.openingBalance),
        openingBalanceDate: values.openingBalanceDate,
      })
      .subscribe({
        next: (account) => {
          this.store.addAccount(account);
          this.alertService.showSuccess({ feature: "account", action: "create" });
          this.resetForm();
          // The create response may not include the derived balance fields.
          void this.store.refresh().catch((error) => {
            console.error("Error refreshing accounts:", error);
          });
        },
        error: (error: unknown) => this.handleError(error, "No se pudo crear la cuenta."),
      });
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

  openArchive(account: ApiAccount): void {
    this.archiveTarget.set(account);
  }

  closeArchive(): void {
    this.archiveTarget.set(null);
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.archiveTarget()) this.closeArchive();
  }

  confirmArchive(): void {
    const account = this.archiveTarget();

    if (!account) return;

    this.formSubmit.archiveAccount(account.id).subscribe({
      next: () => {
        this.store.removeAccount(account.id);
        this.closeArchive();
        this.alertService.showSuccess({ feature: "account", action: "delete" });
      },
      error: (error: unknown) => {
        this.closeArchive();
        this.handleError(error, "No se pudo archivar la cuenta.", "delete");
      },
    });
  }

  private handleInvalidForm(): void {
    if (!this.formData.get("name")?.value.trim()) {
      this.showWarning("Agrega un nombre para la cuenta");
      return;
    }

    if (!this.formData.get("openingBalanceDate")?.value) {
      this.showWarning("Selecciona la fecha del saldo inicial");
      return;
    }

    if (this.formData.get("openingBalance")?.hasError("min")) {
      this.showWarning("El saldo inicial no puede ser negativo");
      return;
    }

    this.showWarning("Revisa los datos de la cuenta");
  }

  private showWarning(customMessage: string): void {
    this.alertService.showWarning({ feature: "account", action: "create", customMessage });
  }

  private handleError(
    error: unknown,
    fallback: string,
    action: "create" | "delete" = "create",
  ): void {
    this.alertService.showError({
      feature: "account",
      action,
      customMessage: extractApiErrorMessage(error, fallback),
    });
  }

  private resetForm(): void {
    this.formData.reset({
      name: "",
      type: "bank",
      openingBalance: 0,
      openingBalanceDate: this.localToday(),
    });
  }

  /** Today's date in local time as `YYYY-MM-DD`. */
  private localToday(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
  }
}

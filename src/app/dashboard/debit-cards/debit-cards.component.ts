import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";

import { SubmitBttnComponent } from "@app/core";
import type { DebitCard } from "@app/models";
import { AlertService, FormSubmitService } from "@app/services";
import { AccountsStore, DebitCardsStore } from "@app/store";
import { extractApiErrorMessage } from "@app/utils";

interface DebitCardForm {
  accountId: FormControl<string>;
  name: FormControl<string>;
  last4: FormControl<string>;
}

@Component({
  selector: "app-debit-cards",
  imports: [ReactiveFormsModule, SubmitBttnComponent, RouterLink],
  templateUrl: "./debit-cards.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebitCardsComponent {
  private readonly formSubmit = inject(FormSubmitService);
  private readonly title = inject(Title);
  private readonly accountsStore = inject(AccountsStore);
  readonly store = inject(DebitCardsStore);
  readonly alertService = inject(AlertService);

  readonly debitCards = this.store.debitCards;
  readonly deleteTarget = signal<DebitCard | null>(null);

  /** Debit cards can only be linked to bank accounts. */
  readonly bankAccounts = computed(() =>
    this.accountsStore.accounts().filter((account) => account.isActive && account.type === "bank"),
  );

  readonly formData = this.buildForm();

  constructor() {
    this.title.setTitle("Tarjetas de débito | Money Minder");
  }

  private buildForm() {
    return new FormGroup<DebitCardForm>({
      accountId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      name: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      last4: new FormControl("", {
        nonNullable: true,
        validators: [Validators.pattern(/^\d{4}$/)],
      }),
    });
  }

  accountName(card: DebitCard): string {
    return (
      card.account?.name ||
      card.accountName ||
      this.bankAccounts().find((account) => account.id === card.accountId)?.name ||
      "—"
    );
  }

  onSubmit(): void {
    if (this.formData.invalid) {
      this.handleInvalidForm();
      return;
    }

    const values = this.formData.getRawValue();

    this.formSubmit
      .debitCardSubmit({
        accountId: values.accountId,
        name: values.name.trim(),
        last4: values.last4 || undefined,
      })
      .subscribe({
        next: (card) => {
          this.store.addDebitCard(card);
          this.alertService.showSuccess({ feature: "debitCard", action: "create" });
          this.resetForm();
          void this.store.refresh().catch((error) => {
            console.error("Error refreshing debit cards:", error);
          });
        },
        error: (error: unknown) => this.handleError(error, "No se pudo agregar la tarjeta."),
      });
  }

  openDelete(card: DebitCard): void {
    this.deleteTarget.set(card);
  }

  closeDelete(): void {
    this.deleteTarget.set(null);
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.deleteTarget()) this.closeDelete();
  }

  confirmDelete(): void {
    const card = this.deleteTarget();

    if (!card) return;

    this.formSubmit.deleteDebitCard(card.id).subscribe({
      next: () => {
        this.store.removeDebitCard(card.id);
        this.closeDelete();
        this.alertService.showSuccess({ feature: "debitCard", action: "delete" });
      },
      error: (error: unknown) => {
        this.closeDelete();
        this.handleError(error, "No se pudo eliminar la tarjeta.", "delete");
      },
    });
  }

  private handleInvalidForm(): void {
    if (!this.formData.get("name")?.value.trim()) {
      this.showWarning("Agrega un nombre para la tarjeta");
      return;
    }

    if (!this.formData.get("accountId")?.value) {
      this.showWarning("Selecciona la cuenta bancaria asociada");
      return;
    }

    if (this.formData.get("last4")?.invalid) {
      this.showWarning("Los últimos 4 dígitos deben ser exactamente 4 números");
      return;
    }

    this.showWarning("Revisa los datos de la tarjeta");
  }

  private showWarning(customMessage: string): void {
    this.alertService.showWarning({ feature: "debitCard", action: "create", customMessage });
  }

  private handleError(
    error: unknown,
    fallback: string,
    action: "create" | "delete" = "create",
  ): void {
    this.alertService.showError({
      feature: "debitCard",
      action,
      customMessage: extractApiErrorMessage(error, fallback),
    });
  }

  private resetForm(): void {
    this.formData.reset({ accountId: "", name: "", last4: "" });
  }
}

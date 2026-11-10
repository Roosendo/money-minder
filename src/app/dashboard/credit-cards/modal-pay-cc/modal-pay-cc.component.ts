import { CurrencyPipe } from "@angular/common";
import { Component, HostListener, type OnInit, inject, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import type { ApiAccount, CreditCards } from "@app/models";
import { AlertService } from "@app/services";
import { isValidNonNegativeMoney, isValidPositiveMoney } from "@app/utils";

interface CardPaymentForm {
  fromAccountId: FormControl<string>;
  amount: FormControl<number>;
  fee: FormControl<number>;
  date: FormControl<string>;
}

export interface CardPaymentPayload {
  fromAccountId: string;
  amount: number;
  fee: number;
  occurredAt: string;
}

@Component({
  selector: "app-modal-pay-cc",
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: "./modal-pay-cc.component.html",
})
export class ModalPayCcComponent implements OnInit {
  creditCard = input.required<CreditCards>();
  accounts = input.required<ApiAccount[]>();
  pay = output<CardPaymentPayload>();
  close = output<void>();

  private readonly alertService = inject(AlertService);

  readonly formData = new FormGroup<CardPaymentForm>({
    fromAccountId: new FormControl("", {
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
  });

  ngOnInit(): void {
    const preferred = this.creditCard().paymentAccountId;
    const fromAccountId =
      this.accounts().find((account) => account.id === preferred)?.id ??
      this.accounts()[0]?.id ??
      "";

    this.formData.patchValue({ fromAccountId });
  }

  onSubmit(): void {
    const values = this.formData.getRawValue();

    if (!values.fromAccountId) {
      this.warn("Selecciona la cuenta desde la que pagarás");
      return;
    }

    if (!isValidPositiveMoney(values.amount)) {
      this.warn("El monto debe ser mayor a 0 y tener máximo dos decimales");
      return;
    }

    if (!isValidNonNegativeMoney(values.fee)) {
      this.warn("La comisión no puede ser negativa y admite máximo dos decimales");
      return;
    }

    if (!values.date) {
      this.warn("Selecciona la fecha del pago");
      return;
    }

    this.pay.emit({
      fromAccountId: values.fromAccountId,
      amount: values.amount,
      fee: values.fee,
      occurredAt: values.date,
    });
  }

  onClose(): void {
    this.close.emit();
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    this.onClose();
  }

  private warn(customMessage: string): void {
    this.alertService.showWarning({ feature: "creditCard", action: "update", customMessage });
  }

  private localToday(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
  }
}

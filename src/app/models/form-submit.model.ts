import type { Money, WritableAccountType } from "./api.model";

interface BaseTransaction {
  date: string;
  amount: number;
  category: string;
  description?: string;
}

export interface NewAccount {
  name: string;
  type: WritableAccountType;
  openingBalance: Money;
  openingBalanceDate: string;
}

export interface NewTransfer {
  fromAccountId: string;
  toAccountId: string;
  amount: Money;
  fee?: Money;
  description?: string;
  occurredAt?: string;
}

export interface NewDebitCard {
  accountId: string;
  name: string;
  last4?: string;
}

export interface NewEntry extends BaseTransaction {}

export interface NewExit extends BaseTransaction {
  creditCardId: string | null;
}

export interface NewSaving {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

interface BaseTransaction {
  date: string;
  amount: number;
  category: string;
  description?: string;
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

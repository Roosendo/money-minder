import { inject, InjectionToken } from "@angular/core";
import type { CreditCards, Purchases, Transaction } from "@app/models";
import { ApiCallsService } from "@app/services";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { withEntities } from "@ngrx/signals/entities";
import { firstValueFrom } from "rxjs";

type CreditCardsState = {
  creditCards: CreditCards[];
  purchases: Purchases[];
  cardTransactions: Transaction[];
};

const initialState: CreditCardsState = {
  creditCards: [],
  purchases: [],
  cardTransactions: [],
};

const CREDIT_CARDS_STATE = new InjectionToken<CreditCardsState>("CreditCardsState", {
  factory: () => initialState,
});

export const CreditCardsStore = signalStore(
  { providedIn: "root" },
  withState(() => inject(CREDIT_CARDS_STATE)),
  withEntities<CreditCardsState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearCreditCards(): void {
      patchState(store, {
        creditCards: initialState.creditCards,
        purchases: initialState.purchases,
        cardTransactions: initialState.cardTransactions,
      });
    },

    async updateCreditCards(): Promise<void> {
      const creditCards = await firstValueFrom(apiCallsService.getCreditCards());
      patchState(store, { creditCards });
    },

    addCreditCard(creditCard: CreditCards): void {
      const updatedCreditCards = [...store.creditCards(), creditCard];
      patchState(store, { creditCards: updatedCreditCards });
    },

    deleteCreditCard(creditCardId: string): void {
      const updatedCreditCards = store.creditCards().filter((c) => c.id !== creditCardId);
      patchState(store, { creditCards: updatedCreditCards });
    },

    clearPurchases(): void {
      patchState(store, { purchases: initialState.purchases });
    },

    async updatePurchases(): Promise<void> {
      const purchases = await firstValueFrom(apiCallsService.getPurchases());
      patchState(store, { purchases });
    },

    async updateCardTransactions(): Promise<void> {
      const cardTransactions = await firstValueFrom(apiCallsService.getAllCardTransactions());
      patchState(store, { cardTransactions });
    },

    addPurchase(purchase: Purchases): void {
      const updatedPurchases = [purchase, ...store.purchases()];
      patchState(store, { purchases: updatedPurchases });
    },
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const creditCards = await firstValueFrom(apiCallsService.getCreditCards());
        const purchases = await firstValueFrom(apiCallsService.getPurchases());
        const cardTransactions = await firstValueFrom(apiCallsService.getAllCardTransactions());

        patchState(store, { creditCards, purchases, cardTransactions });
      } catch (error) {
        console.error("Error fetching Credit Cards:", error);
        patchState(store, {
          creditCards: initialState.creditCards,
          purchases: initialState.purchases,
          cardTransactions: initialState.cardTransactions,
        });
      }
    },
  }),
);

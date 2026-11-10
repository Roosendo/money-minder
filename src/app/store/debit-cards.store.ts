import { InjectionToken, inject } from "@angular/core";
import type { DebitCard } from "@app/models";
import { ApiCallsService } from "@app/services";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";

type DebitCardsState = {
  debitCards: DebitCard[];
};

const initialState: DebitCardsState = {
  debitCards: [],
};

const DEBIT_CARDS_STATE = new InjectionToken<DebitCardsState>("DebitCardsState", {
  factory: () => initialState,
});

export const DebitCardsStore = signalStore(
  { providedIn: "root" },
  withState(() => inject(DEBIT_CARDS_STATE)),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearDebitCards(): void {
      patchState(store, initialState);
    },

    async refresh(): Promise<void> {
      const result = await firstValueFrom(apiCallsService.getDebitCards(undefined, 1, 100));
      patchState(store, { debitCards: result.items });
    },

    addDebitCard(card: DebitCard): void {
      patchState(store, { debitCards: [...store.debitCards(), card] });
    },

    editDebitCard(card: DebitCard): void {
      patchState(store, {
        debitCards: store
          .debitCards()
          .map((current) => (current.id === card.id ? { ...current, ...card } : current)),
      });
    },

    removeDebitCard(id: string): void {
      patchState(store, {
        debitCards: store.debitCards().filter((card) => card.id !== id),
      });
    },
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const result = await firstValueFrom(apiCallsService.getDebitCards(undefined, 1, 100));
        patchState(store, { debitCards: result.items });
      } catch (error) {
        console.error("Error fetching debit cards:", error);
        patchState(store, initialState);
      }
    },
  }),
);

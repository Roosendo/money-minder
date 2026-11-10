import { InjectionToken, inject } from "@angular/core";
import type { ApiCategory } from "@app/models";
import { ApiCallsService } from "@app/services";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";

type TransactionCategoriesState = {
  categories: ApiCategory[];
};

const initialState: TransactionCategoriesState = {
  categories: [],
};

const TRANSACTION_CATEGORIES_STATE = new InjectionToken<TransactionCategoriesState>(
  "TransactionCategoriesState",
  {
    factory: () => initialState,
  },
);

/**
 * Global plus user-owned categories used by the transaction form. Kept
 * separate from `CategoriesStore`, which holds chart aggregates.
 */
export const TransactionCategoriesStore = signalStore(
  { providedIn: "root" },
  withState(() => inject(TRANSACTION_CATEGORIES_STATE)),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearCategories(): void {
      patchState(store, { categories: initialState.categories });
    },

    async updateCategories(): Promise<void> {
      const categories = await firstValueFrom(apiCallsService.getCategories());
      patchState(store, { categories });
    },
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const categories = await firstValueFrom(apiCallsService.getCategories());
        patchState(store, { categories });
      } catch (error) {
        console.error("Error fetching transaction categories:", error);
        patchState(store, { categories: initialState.categories });
      }
    },
  }),
);

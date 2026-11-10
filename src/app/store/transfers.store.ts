import { InjectionToken, inject } from "@angular/core";
import type { Transfer } from "@app/models";
import { ApiCallsService } from "@app/services";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";

const PAGE_SIZE = 15;

type TransfersState = {
  transfers: Transfer[];
  page: number;
  totalPages: number;
};

const initialState: TransfersState = {
  transfers: [],
  page: 1,
  totalPages: 1,
};

const TRANSFERS_STATE = new InjectionToken<TransfersState>("TransfersState", {
  factory: () => initialState,
});

export const TransfersStore = signalStore(
  { providedIn: "root" },
  withState(() => inject(TRANSFERS_STATE)),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearTransfers(): void {
      patchState(store, initialState);
    },

    async loadPage(page = 1): Promise<void> {
      const result = await firstValueFrom(apiCallsService.getTransfers(page, PAGE_SIZE));

      patchState(store, {
        transfers: result.items,
        page: result.page,
        totalPages: Math.max(1, result.totalPages),
      });
    },

    async refresh(): Promise<void> {
      const result = await firstValueFrom(apiCallsService.getTransfers(1, PAGE_SIZE));

      patchState(store, {
        transfers: result.items,
        page: result.page,
        totalPages: Math.max(1, result.totalPages),
      });
    },
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const result = await firstValueFrom(apiCallsService.getTransfers(1, PAGE_SIZE));

        patchState(store, {
          transfers: result.items,
          page: result.page,
          totalPages: Math.max(1, result.totalPages),
        });
      } catch (error) {
        console.error("Error fetching transfers:", error);
        patchState(store, initialState);
      }
    },
  }),
);

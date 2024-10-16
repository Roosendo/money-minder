import { InjectionToken, inject } from '@angular/core'
import type { FinancialSummary } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { firstValueFrom } from 'rxjs'

type FinancialSummaryState = {
  financialSummary: FinancialSummary
}

const initialState: FinancialSummaryState = {
  financialSummary: {
    totalEntries: 0,
    totalExits: 0,
  }
}

const FINANCIAL_SUMMARY_STATE = new InjectionToken<FinancialSummaryState>('FinancialSummaryState', {
  factory: () => initialState
})

export const FinancialSummaryStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(FINANCIAL_SUMMARY_STATE)),
  withEntities<FinancialSummaryState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    deleteFinancialSummary(): void {
      patchState(store, { financialSummary: initialState.financialSummary })
    },

    async updateFinancialSummary(): Promise<void> {
      const financialSummary = await firstValueFrom(apiCallsService.getFinancialSummary())
      patchState(store, { financialSummary })
    },

    /**
     * Adds an entry to the total entries, it should be from the current year
     * @param entry - The amount to add to the total entries
     * @returns void - No return, updates the store
     */
    addSummaryEntry(entry: number): void {
      patchState(store, {
        financialSummary: {
          ...store.financialSummary(),
          totalEntries: store.financialSummary().totalEntries + entry,
        }
      })
    },

    /**
     * Adds an exit to the total exits, it should be from the current year
     * @param exit - The amount to add to the total exits
     * @returns void - No return, updates the store
     */
    addSummaryExit(exit: number): void {
      patchState(store, {
        financialSummary: {
          ...store.financialSummary(),
          totalExits: store.financialSummary().totalExits + exit,
        }
      })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const financialSummary = await firstValueFrom(apiCallsService.getFinancialSummary())
        patchState(store, { financialSummary })
      } catch (error) {
        console.error('Error fetching financial summary:', error)
        patchState(store, { financialSummary: { totalEntries: 0, totalExits: 0 } })
      }
    }
  })
)

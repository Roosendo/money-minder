import { inject, InjectionToken } from '@angular/core'
import type { Saving } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { lastValueFrom } from 'rxjs'

type SavingsState = {
  savings: Saving[]
}

const initialState: SavingsState = {
  savings: []
}

const SAVINGS_STATE = new InjectionToken('SavingsState', {
  factory: () => initialState
})

export const SavingsStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(SAVINGS_STATE)),
  withEntities<SavingsState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearSavings(): void {
      patchState(store, { savings: initialState.savings })
    },

    async updateSavings(): Promise<void> {
      const savings = await lastValueFrom(apiCallsService.getSavings())
      patchState(store, { savings })
    },

    addSaving(saving: Saving): void {
      patchState(store, { savings: [ saving, ...store.savings() ] })
    },

    editSaving(saving: Saving): void {
      patchState(store, {
        savings: store.savings().map(s => s.id === saving.id ? { ...s, ...saving } : s)
      })
    },

    removeSaving(id: number): void {
      patchState(store, { savings: store.savings().filter(saving => saving.id !== id) })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const savings = await lastValueFrom(apiCallsService.getSavings())
        patchState(store, { savings })
      } catch (error) {
        console.error('Error fetching savings:', error)
        patchState(store, { savings: initialState.savings })
      }
    }
  })
)

import { inject, InjectionToken } from '@angular/core'
import type { RecentTransactions } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { lastValueFrom } from 'rxjs'

type TransactionState = {
  recentTransactions: RecentTransactions[]
}

const initialState: TransactionState = {
  recentTransactions: []
}

const TRANSACTION_STATE = new InjectionToken<TransactionState>('TransactionState', {
  factory: () => initialState
})

export const TransactionsStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(TRANSACTION_STATE)),
  withEntities<TransactionState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    deleteRecentTransactions(): void {
      patchState(store, { recentTransactions: initialState.recentTransactions })
    },

    async updateRecentTransactions(): Promise<void> {
      const recentTransactions = await lastValueFrom(apiCallsService.getRecentTransactions())
      patchState(store, { recentTransactions })
    },

    addRecentTransaction(transaction: RecentTransactions): void {
      patchState(store, { recentTransactions: [ transaction, ...store.recentTransactions() ] })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const recentTransactions = await lastValueFrom(apiCallsService.getRecentTransactions())
        patchState(store, { recentTransactions })
      } catch (error) {
        console.error('Error fetching recent transactions:', error)
        patchState(store, { recentTransactions: [] })
      }
    }
  })
)

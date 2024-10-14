import { InjectionToken, inject } from '@angular/core'
import type { RecentTransactions, Transaction } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { lastValueFrom } from 'rxjs'

type TransactionState = {
  recentTransactions: RecentTransactions[],
  entries: Transaction[],
  exits: Transaction[]
}

const initialState: TransactionState = {
  recentTransactions: [],
  entries: [],
  exits: []
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
      const updatedTransactions = [transaction, ...store.recentTransactions()]
      if (updatedTransactions.length > 8) {
        updatedTransactions.pop()
      }
      patchState(store, { recentTransactions: updatedTransactions })
    },

    addEntry(entry: Transaction): void {
      const updatedEntries = [entry, ...store.entries()]
      if (updatedEntries.length > 15) {
        updatedEntries.pop()
      }
      patchState(store, { entries: updatedEntries })
    },

    addExit(exit: Transaction): void {
      const updatedExits = [exit, ...store.exits()]
      if (updatedExits.length > 15) {
        updatedExits.pop()
      }
      patchState(store, { exits: updatedExits })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const recentTransactions = await lastValueFrom(apiCallsService.getRecentTransactions())
        const entries = await lastValueFrom(apiCallsService.getLastEntries())
        const exits = await lastValueFrom(apiCallsService.getLastExits())

        patchState(store, { recentTransactions, entries, exits })
      } catch (error) {
        console.error('Error fetching recent transactions:', error)
        patchState(store, { recentTransactions: [] })
      }
    }
  })
)

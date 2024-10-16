import { InjectionToken, inject } from '@angular/core'
import type { CashFLow } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { firstValueFrom } from 'rxjs'
import { addNewTransaction, findTransactionIndex, isValidMonth, updateExistingTransaction } from './cash-flow.utils'

type CashFlowState = {
  cashFlow: CashFLow[]
}

const initialState: CashFlowState = {
  cashFlow: []
}

const CASH_FLOW_STATE = new InjectionToken<CashFlowState>('CashFlowState', {
  factory: () => initialState
})

export const CashFlowStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CASH_FLOW_STATE)),
  withEntities<CashFlowState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearCashFlow(): void {
      patchState(store, { cashFlow: initialState.cashFlow })
    },

    async updateCashFlow(): Promise<void> {
      const cashFlow = await firstValueFrom(apiCallsService.getCashFlow())
      patchState(store, { cashFlow })
    },

    addEntryTransaction(month: string, amount: number): void {
      if (!isValidMonth(month)) {
        throw new Error('Invalid month format. Month should be a string in MM format.')
      }

      const cashFlow = store.cashFlow()
      const existingTransactionIndex = findTransactionIndex(cashFlow, month)

      if (existingTransactionIndex !== -1) {
        const existingTransaction = cashFlow[existingTransactionIndex]
        updateExistingTransaction(cashFlow, existingTransactionIndex, {
          ...existingTransaction,
          total_ingresos: existingTransaction.total_ingresos + amount
        })
      } else {
        addNewTransaction(cashFlow, {
          month,
          total_ingresos: amount,
          total_egresos: 0
        })
      }

      patchState(store, { cashFlow })
    },

    addExitTransaction(month: string, amount: number): void {
      if (!isValidMonth(month)) {
        throw new Error('Invalid month format. Month should be a string in MM format.')
      }

      const cashFlow = store.cashFlow()
      const existingTransactionIndex = findTransactionIndex(cashFlow, month)

      if (existingTransactionIndex !== -1) {
        const existingTransaction = cashFlow[existingTransactionIndex]
        updateExistingTransaction(cashFlow, existingTransactionIndex, {
          ...existingTransaction,
          total_egresos: existingTransaction.total_egresos + amount
        })
      } else {
        addNewTransaction(cashFlow, {
          month,
          total_ingresos: 0,
          total_egresos: amount
        })
      }

      patchState(store, { cashFlow })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const cashFlow = await firstValueFrom(apiCallsService.getCashFlow())
        patchState(store, { cashFlow })
      } catch (error) {
        console.error('Error fetching cash flow:', error)
        patchState(store, { cashFlow: initialState.cashFlow })
      }
    }
  })
)

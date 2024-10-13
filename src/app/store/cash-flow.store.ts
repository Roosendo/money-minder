import { InjectionToken, inject } from '@angular/core'
import type { CashFLow, MonthString } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { lastValueFrom } from 'rxjs'

type CashFlowState = {
  cashFlow: CashFLow[]
}

const initialState: CashFlowState = {
  cashFlow: []
}

const CASH_FLOW_STATE = new InjectionToken<CashFlowState>('CashFlowState', {
  factory: () => initialState
})

function isValidMonth(month: string): month is MonthString {
  return /^(0[1-9]|1[0-2])$/.test(month)
}

export const CashFlowStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CASH_FLOW_STATE)),
  withEntities<CashFlowState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearCashFlow(): void {
      patchState(store, { cashFlow: initialState.cashFlow })
    },

    async updateCashFlow(): Promise<void> {
      const cashFlow = await lastValueFrom(apiCallsService.getCashFlow())
      patchState(store, { cashFlow })
    },

    addTransaction(transaction: CashFLow): void {
      if (!isValidMonth(transaction.month)) {
        throw new Error('Invalid month format. Month should be a string in MM format.')
      }

      const cashFlow = store.cashFlow()
      const existingTransactionIndex = cashFlow.findIndex(t => t.month === transaction.month)

      if (existingTransactionIndex !== -1) {
        const updatedTransaction = {
          ...cashFlow[existingTransactionIndex],
          ...transaction,
          total_egresos: cashFlow[existingTransactionIndex].total_egresos + transaction.total_egresos,
          total_ingresos: cashFlow[existingTransactionIndex].total_ingresos + transaction.total_ingresos
        }
        cashFlow[existingTransactionIndex] = updatedTransaction
      } else {
        cashFlow.push(transaction)
        cashFlow.sort((a, b) => a.month.localeCompare(b.month))
      }

      patchState(store, { cashFlow })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const cashFlow = await lastValueFrom(apiCallsService.getCashFlow())
        patchState(store, { cashFlow })
      } catch (error) {
        console.error('Error fetching cash flow:', error)
        patchState(store, { cashFlow: initialState.cashFlow })
      }
    }
  })
)

import { InjectionToken, inject } from '@angular/core'
import type { EditPayment, Loans, NewPayment } from '@app/models'
import { ApiCallsService } from '@app/services'
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { firstValueFrom } from 'rxjs'
import { updateSpecificPayment, calculatePaymentDifference, addNewPayment } from './loans.utils'

type LoansState = {
  loans: Loans[]
}

const initialState: LoansState = {
  loans: []
}

const LOANS_STATE = new InjectionToken<LoansState>('LoansState', {
  factory: () => initialState
})

export const LoansStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(LOANS_STATE)),
  withEntities<LoansState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearLoans(): void {
      patchState(store, { loans: initialState.loans })
    },

    async updateLoans(): Promise<void> {
      const loans = await firstValueFrom(apiCallsService.getLoans())
      patchState(store, { loans })
    },

    async addLoan(newLoan: Loans): Promise<void> {
      patchState(store, {
        loans: [...store.loans(), newLoan]
      })
    },

    async updatePayment(editPayment: EditPayment): Promise<void> {
      patchState(store, {
        loans: store.loans().map((loan) => {
          const paymentIndex = loan.last_five_payments.findIndex(
            (payment) => payment.id === editPayment.paymentId
          )

          if (paymentIndex === -1) return loan // Si no existe el pago, devolver el préstamo sin cambios

          const originalPayment = loan.last_five_payments[paymentIndex]

          // Usar función utilitaria para actualizar el pago específico
          const updatedPayments = updateSpecificPayment(loan.last_five_payments, editPayment)

          // Usar función utilitaria para calcular la diferencia en total_payments
          const difference = calculatePaymentDifference(
            originalPayment.payment_amount,
            editPayment.paymentAmount
          )

          return {
            ...loan,
            last_five_payments: updatedPayments,
            total_payments: loan.total_payments + difference
          }
        })
      })
    },

    async addPayment(newPayment: NewPayment): Promise<void> {
      patchState(store, {
        loans: store.loans().map((loan) => {
          if (loan.id !== newPayment.loanId) return loan // Si no es el préstamo correcto, devolver sin cambios

          // Agregar el nuevo pago y mantener solo los últimos cinco
          const updatedPayments = addNewPayment(loan.last_five_payments, newPayment)

          // Actualizar el total de pagos
          const updatedTotalPayments = loan.total_payments + newPayment.paymentAmount

          return {
            ...loan,
            last_five_payments: updatedPayments,
            total_payments: updatedTotalPayments
          }
        })
      })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const loans = await firstValueFrom(apiCallsService.getLoans())

        patchState(store, { loans })
      } catch (error) {
        console.error('Error fetching Loans:', error)
        patchState(store, { loans: initialState.loans })
      }
    }
  })
)

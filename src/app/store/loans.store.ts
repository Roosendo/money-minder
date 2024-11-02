import { InjectionToken, inject } from '@angular/core'
import type { Loans } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { firstValueFrom } from 'rxjs'

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
    },
  })
)

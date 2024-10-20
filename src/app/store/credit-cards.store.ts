import { inject, InjectionToken } from '@angular/core'
import type { CreditCards } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { firstValueFrom } from 'rxjs'

type CreditCardsState = {
  creditCards: CreditCards[]
}

const initialState: CreditCardsState = {
  creditCards: []
}

const CREDIT_CARDS_STATE = new InjectionToken<CreditCardsState>('CreditCardsState', {
  factory: () => initialState
})

export const CreditCardsStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CREDIT_CARDS_STATE)),
  withEntities<CreditCardsState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearCreditCards(): void {
      patchState(store, { creditCards: initialState.creditCards })
    },

    async updateCreditCards(): Promise<void> {
      const creditCards = await firstValueFrom(apiCallsService.getCreditCards())
      patchState(store, { creditCards })
    },

    addCreditCard(creditCard: CreditCards): void {
      const updatedCreditCards = [creditCard, ...store.creditCards()]
      patchState(store, { creditCards: updatedCreditCards })
    },

    deleteCreditCard(creditCard: CreditCards): void {
      const updatedCreditCards = store.creditCards().filter((c) => c.credit_card_id  !== creditCard.credit_card_id)
      patchState(store, { creditCards: updatedCreditCards })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const creditCards = await firstValueFrom(apiCallsService.getCreditCards())

        patchState(store, { creditCards })
      } catch (error) {
        console.error('Error fetching Credit Cards:', error)
        patchState(store, { creditCards: initialState.creditCards })
      }
    }
  })
)

import { InjectionToken, inject } from '@angular/core'
import type { Quote } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { firstValueFrom } from 'rxjs'

type QuoteState = {
  quote: Quote
}

const initialState: QuoteState = {
  quote: {
    phrase: '',
    movie: '',
    character: ''
  }
}

const QUOTE_STATE = new InjectionToken<QuoteState>('QuoteState', {
  factory: () => initialState
})

export const QuoteStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(QUOTE_STATE)),
  withEntities<QuoteState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    deleteQuote(): void {
      patchState(store, { quote: initialState.quote })
    },

    async updateQuote(): Promise<void> {
      const quote = await firstValueFrom(apiCallsService.getQuote())
      patchState(store, { quote })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const quote = await firstValueFrom(apiCallsService.getQuote())
        patchState(store, { quote })
      } catch (error) {
        console.error('Error fetching quote:', error)
        patchState(store, { quote: { phrase: 'Error fetching quote', movie: 'Errorland', character: 'Error' } })
      }
    }
  })
)

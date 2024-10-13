import { inject, InjectionToken } from '@angular/core'
import type { TransactionChart } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { lastValueFrom } from 'rxjs'

type CategoriesState = {
  categories: TransactionChart[]
}

const initialState: CategoriesState = {
  categories: []
}

const CATEGORIES_STATE = new InjectionToken<CategoriesState>('CategoriesState', {
  factory: () => initialState
})

export const CategoriesStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CATEGORIES_STATE)),
  withEntities<CategoriesState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    // * add methods to store here
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const categories = await lastValueFrom(apiCallsService.getMainCategories())
        patchState(store, { categories })
      } catch (error) {
        console.error('Error fetching categories:', error)
        patchState(store, { categories: initialState.categories })
      }
    }
  })
)

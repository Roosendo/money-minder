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
    clearCategories(): void {
      patchState(store, { categories: initialState.categories })
    },

    async updateCategories(): Promise<void> {
      const categories = await lastValueFrom(apiCallsService.getMainCategories())
      patchState(store, { categories })
    },

    /**
     * Adds a category to the store, if the category already exists it will update the total
     * The category to add should be from the current year
     * @param category - The category to add to the store
     * @returns void - No return, updates the store
     */
    addTransactionCategory(category: TransactionChart): void {
      const existingCategory = store.categories().find(cat => cat.category === category.category)

      if (existingCategory) {
        existingCategory.total += category.total
        patchState(store, { categories: [...store.categories()] })
      } else {
        patchState(store, { categories: [...store.categories(), category] })
      }
    }
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

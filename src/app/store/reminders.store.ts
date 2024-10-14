import { inject, InjectionToken } from '@angular/core'
import type { Reminder } from '@app/models'
import { ApiCallsService } from '@app/services'
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { lastValueFrom } from 'rxjs'

type RemindersState = {
  reminders: Reminder[]
}

const initialState: RemindersState = {
  reminders: []
}

const REMINDERS_STATE = new InjectionToken('RemindersState', {
  factory: () => initialState
})

export const RemindersStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(REMINDERS_STATE)),
  withEntities<RemindersState>(),
  withMethods((store, apiCallsService = inject(ApiCallsService)) => ({
    clearReminders(): void {
      patchState(store, { reminders: initialState.reminders })
    },

    async updateReminders(): Promise<void> {
      const reminders = await lastValueFrom(apiCallsService.getReminders())
      patchState(store, { reminders })
    },

    addReminder(reminder: Reminder): void {
      patchState(store, { reminders: [ reminder, ...store.reminders() ] })
    },

    removeReminder(id: number): void {
      patchState(store, { reminders: store.reminders().filter(reminder => reminder.id !== id) })
    }
  })),
  withHooks({
    async onInit(store, apiCallsService = inject(ApiCallsService)) {
      try {
        const reminders = await lastValueFrom(apiCallsService.getReminders())
        patchState(store, { reminders })
      } catch (error) {
        console.error('Error fetching reminders:', error)
        patchState(store, { reminders: initialState.reminders })
      }
    }
  })
)

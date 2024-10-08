import {
  type ApplicationConfig,
  provideExperimentalZonelessChangeDetection, isDevMode
} from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'

import { provideHttpClient, withFetch } from '@angular/common/http'
import { provideClientHydration } from '@angular/platform-browser'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools'

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
    provideCharts(withDefaultRegisterables()),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
}

import {
  type ApplicationConfig,
  provideExperimentalZonelessChangeDetection
} from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'

import { provideHttpClient, withFetch } from '@angular/common/http'
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'
import { routes } from './app.routes'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withIncrementalHydration()),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
    provideCharts(withDefaultRegisterables()),
    provideAnimationsAsync(),
  ]
}

import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'

import { routes } from './app.routes'
import { provideClientHydration } from '@angular/platform-browser'
import { provideHttpClient, withFetch } from '@angular/common/http'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()), provideCharts(withDefaultRegisterables())
  ]
}

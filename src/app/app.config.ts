import { type ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideClientHydration, withNoIncrementalHydration } from "@angular/platform-browser";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { routes } from "./app.routes";
import { authInterceptor } from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withNoIncrementalHydration()),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideCharts(withDefaultRegisterables()),
  ],
};

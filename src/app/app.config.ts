import { type ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { provideHttpClient, withFetch } from "@angular/common/http";
import { provideClientHydration } from "@angular/platform-browser";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
    provideCharts(withDefaultRegisterables()),
  ],
};

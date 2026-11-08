import { isPlatformBrowser } from "@angular/common";
import { Injectable, PLATFORM_ID, inject } from "@angular/core";
import { type CanActivateChild, Router, type Routes } from "@angular/router";

import { HomeComponent } from "./home";
import { DashboardLayoutComponent, MainComponent } from "./layouts";
import { AuthCacheService } from "./services";

@Injectable({
  providedIn: "root",
})
class DashboardGuard implements CanActivateChild {
  private readonly auth = inject(AuthCacheService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  async canActivateChild() {
    // The server has no access to the browser session cookie, so the guard
    // defers the decision to the client.
    if (!isPlatformBrowser(this.platformId)) return true;

    const user = await this.auth.ensureSession();
    return user ? true : this.router.createUrlTree(["/login"]);
  }
}

export const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      { path: "", component: HomeComponent },
      {
        path: "login",
        loadComponent: () => import("./login/components/login.component"),
      },
    ],
  },
  {
    path: "",
    component: DashboardLayoutComponent,
    canActivateChild: [DashboardGuard],
    children: [
      {
        path: "dashboard",
        loadComponent: () => import("./dashboard/dashboard/components/dashboard.component"),
      },
      {
        path: "entries",
        loadComponent: () => import("./dashboard/entries/components/entries.component"),
      },
      {
        path: "exits",
        loadComponent: () => import("./dashboard/exits/components/exits.component"),
      },
      {
        path: "analysis",
        loadComponent: () => import("./dashboard/analysis/components/analysis.component"),
      },
      {
        path: "savings",
        loadComponent: () => import("./dashboard/goals/components/goals.component"),
      },
      {
        path: "reminders",
        loadComponent: () => import("./dashboard/reminders/components/reminder.component"),
      },
      {
        path: "credit-cards",
        loadComponent: () =>
          import("./dashboard/credit-cards").then((component) => component.CreditCardsComponent),
      },
      {
        path: "loans",
        loadComponent: () =>
          import("./dashboard/loans").then((component) => component.LoansComponent),
      },
    ],
  },
];

import { Injectable } from '@angular/core'
import type { CanActivateChild, Routes } from '@angular/router'

import { HomeComponent } from './home'
import { DashboardLayoutComponent, MainComponent } from './layouts'

@Injectable({
  providedIn: 'root'
})
class DashboardGuard implements CanActivateChild {
  canActivateChild() {
    return true
  }
}

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'login',
        loadComponent: () => import('./login/components/login.component')
      }
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [DashboardGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard/components/dashboard.component')
      },
      {
        path: 'entries',
        loadComponent: () =>
          import('./dashboard/entries/components/entries.component')
      },
      {
        path: 'exits',
        loadComponent: () =>
          import('./dashboard/exits/components/exits.component')
      },
      {
        path: 'analysis',
        loadComponent: () =>
          import('./dashboard/analysis/components/analysis.component')
      },
      {
        path: 'savings',
        loadComponent: () =>
          import('./dashboard/goals/components/goals.component')
      },
      {
        path: 'reminders',
        loadComponent: () =>
          import('./dashboard/reminders/components/reminder.component')
      },
      {
        path: 'credit-cards',
        loadComponent: () =>
          import('./dashboard/credit-cards').then((component) => component.CreditCardsComponent)
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./dashboard/loans').then((component) => component.LoansComponent)
      }
    ]
  }
]

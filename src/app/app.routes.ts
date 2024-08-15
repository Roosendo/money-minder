import { Routes, CanActivateChild } from '@angular/router'
import { Injectable } from '@angular/core'

import { MainComponent, DashboardLayoutComponent } from './layouts'
import { HomeComponent } from './home'

@Injectable({
  providedIn: 'root'
})
class DashboardGuard implements CanActivateChild {
  canActivateChild () {
    return true
  }
}

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', loadComponent: () => import('./login/components/login.component') }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [DashboardGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard/components/dashboard.component') },
      { path: 'entries', loadComponent: () => import('./dashboard/entries/components/entries.component') },
      { path: 'exits', loadComponent: () => import('./dashboard/exits/components/exits.component') },
      { path: 'analysis', loadComponent: () => import('./dashboard/analysis/components/analysis.component') },
      { path: 'savings', loadComponent: () => import('./dashboard/goals/components/goals.component') },
      { path: 'reminders', loadComponent: () => import('./dashboard/reminders/components/reminder.component') }
    ]
  }
]

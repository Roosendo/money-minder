import { Routes, CanActivateChild } from '@angular/router'
import { Injectable } from '@angular/core'

import { MainComponent, DashboardLayoutComponent } from './layouts'
import { HomeComponent } from './home'
import { LoginComponent } from './login'
import { DashboardComponent } from './dashboard/dashboard'
import { EntriesComponent } from './dashboard/entries'
import { ExitsComponent } from './dashboard/exits'

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
      { path: 'login', component: LoginComponent }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [DashboardGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'entries', component: EntriesComponent },
      { path: 'exits', component: ExitsComponent }
    ]
  }
]

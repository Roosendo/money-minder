import { Routes } from '@angular/router'

import { MainComponent, DashboardLayoutComponent } from './layouts'
import { HomeComponent } from './home'
import { LoginComponent } from './login'
import { DashboardComponent } from './dashboard/dashboard'

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
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardComponent }
    ]
  }
]

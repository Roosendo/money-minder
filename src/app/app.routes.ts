import { Routes } from '@angular/router'

import { MainComponent, DashboardComponent } from './layouts'
import { HomeComponent } from './home'
import { LoginComponent } from './login'

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
    component: DashboardComponent,
    children: [
      // { path: '' }
    ]
  }
]

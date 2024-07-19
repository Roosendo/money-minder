import { Routes } from '@angular/router'

import { HomeComponent } from './home'
import { LoginComponent } from './login'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }
]

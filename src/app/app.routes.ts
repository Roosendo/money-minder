import { Routes } from '@angular/router'
import { HomeComponent } from './home/components/home.component'
import { LoginComponent } from './login/components/login.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }
]

import { Component } from '@angular/core'
import { BtnLoginComponent } from '../../btn-login'

@Component({
  standalone: true,
  imports: [BtnLoginComponent],
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {}

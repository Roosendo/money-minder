import { Component, inject, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { BtnLoginComponent } from '../../btn-login'
import { AuthCacheService } from '../../services/auth-cache.service'

@Component({
  standalone: true,
  imports: [BtnLoginComponent],
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private authCacheService = inject(AuthCacheService)
  private titleService = inject(Title)

  isLogged = this.authCacheService.isAuthenticated()

  ngOnInit () {
    this.titleService.setTitle('Login | Money Minder')
  }
}

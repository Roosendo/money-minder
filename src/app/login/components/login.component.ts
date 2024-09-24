import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { BtnLoginComponent } from '../../btn-login'
import { AuthCacheService } from '../../services/auth-cache.service'

@Component({
  standalone: true,
  imports: [BtnLoginComponent],
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent implements OnInit {
  private authCacheService
  private titleService
  isLogged

  constructor () {
    this.authCacheService = inject(AuthCacheService)
    this.titleService = inject(Title)
    this.isLogged = this.authCacheService.isAuthenticated()
  }

  ngOnInit () {
    this.titleService.setTitle('Login | Money Minder')
  }
}

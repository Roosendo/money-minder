import { NgOptimizedImage, isPlatformBrowser } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core'

import { LoginBttnComponent, NavigationBttnComponent } from '@app/core'
import { AuthCacheService, type User } from '@app/services/auth-cache.service'

@Component({
  selector: 'app-btn-login',
  standalone: true,
  templateUrl: './btn-login.component.html',
  imports: [
    NgOptimizedImage,
    NavigationBttnComponent,
    LoginBttnComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtnLoginComponent implements OnInit {
  private platformId
  private authCache

  user: User | undefined = undefined
  isLogged: boolean

  constructor() {
    this.authCache = inject(AuthCacheService)
    this.platformId = inject(PLATFORM_ID)
    this.isLogged = this.authCache.isAuthenticated()
  }

  redirectTo(provider: string): void {
    const url = `https://money-minder-api.vercel.app/api/${provider}`
    window.location.href = url
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setCookie()
      this.readCookie()
    }
  }

  private setCookie() {
    const params = new URLSearchParams(window.location.search)
    const userParams = params.get('user')

    if (userParams) {
      const userData = JSON.parse(decodeURIComponent(userParams))
      this.authCache.setUser(userData)
      window.location.href = '/login'
    }
  }

  private readCookie() {
    this.authCache.getUser()
    this.user = this.authCache.getUser()
  }

  logout(): void {
    this.authCache.clearUser()
    window.location.href = '/login'
  }
}

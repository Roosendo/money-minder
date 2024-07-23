import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { isPlatformBrowser } from '@angular/common'
import { AuthCacheService, User } from '../../services/auth-cache.service'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-btn-login',
  standalone: true,
  templateUrl: './btn-login.component.html',
  imports: [NgOptimizedImage, RouterLink]
})
export class BtnLoginComponent implements OnInit {
  private platformId = inject(PLATFORM_ID)
  private authCache = inject(AuthCacheService)

  user: User | undefined = undefined
  isLogged: boolean

  constructor() {
    this.isLogged = this.authCache.isAuthenticated()
  }

  redirectTo(provider: string): void {
    const url = `http://localhost:7373/api/${provider}`
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
    console.log(this.user)
  }

  logout(): void {
    this.authCache.clearUser()
    window.location.href = '/login'
  }
}

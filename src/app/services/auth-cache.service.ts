import { inject, Injectable } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'

interface UserApi {
  user: User
}

export interface User {
  email: string
  firstName: string
  lastName: string
  picture: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthCacheService {
  private cookieService = inject(CookieService)
  private expireDate = new Date().getDate() + 7
  private readonly USER_COOKIE_NAME = 'user-data-mm'
  private user: UserApi | null = null

  constructor() {
    this.loadUserFromCookies()
  }

  private loadUserFromCookies() {
    const userData = this.cookieService.get(this.USER_COOKIE_NAME)
    if (userData) this.user = JSON.parse(decodeURIComponent(userData))
  }

  getUser() {
    return this.user?.user
  }

  setUser(user: UserApi) {
    const userData = encodeURIComponent(JSON.stringify(user))
    this.cookieService.set(
      this.USER_COOKIE_NAME,
      userData,
      this.expireDate,
      '/',
      'localhost',
      true,
      'Strict'
    )
    this.user = user
  }

  clearUser() {
    this.cookieService.delete(this.USER_COOKIE_NAME)
    this.user = null
  }

  isAuthenticated() {
    return this.user !== null
  }
}

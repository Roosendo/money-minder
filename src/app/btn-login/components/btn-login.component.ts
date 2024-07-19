import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { isPlatformBrowser } from '@angular/common'
import { CookieService } from 'ngx-cookie-service'

interface UserApi {
  email: string
  firstName: string
  lastName: string
  picture: string
}

@Component({
  selector: 'app-btn-login',
  standalone: true,
  templateUrl: './btn-login.component.html',
  imports: [NgOptimizedImage]
})
export class BtnLoginComponent implements OnInit {
  private platformId = inject(PLATFORM_ID)
  private cookieService = inject(CookieService)

  public user: UserApi | null = null
  private expireDate = new Date().getDate() + 7

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
      localStorage.setItem('user', JSON.stringify(userData))
      this.cookieService.set(
        'user',
        `${encodeURIComponent(JSON.stringify(userData.user))}`,
        this.expireDate,
        '/',
        'localhost',
        true,
        'Strict'
      )
      window.location.href = '/login'
    }
  }

  private readCookie() {
    const userCookie = this.cookieService.get('user')
    this.user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null
    console.log(this.user)
  }
}

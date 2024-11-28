import { CommonModule, NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

import { BtnLoginComponent } from '@app/btn-login'
import { ThemeToggleComponent } from '@app/core'
import { AuthCacheService, type User } from '@app/services'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [
    NgOptimizedImage,
    RouterLink,
    ThemeToggleComponent,
    BtnLoginComponent,
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private readonly authCacheService
  private readonly router

  isLogged: boolean
  user: User | undefined

  constructor() {
    this.authCacheService = inject(AuthCacheService)
    this.router = inject(Router)

    this.isLogged = this.authCacheService.isAuthenticated()
    this.user = this.authCacheService.getUser()
  }

  isSidebarOpen = false

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar')
    const separator = document.getElementById('separator-sidebar')

    sidebar?.classList.toggle('-translate-x-full', this.isSidebarOpen)
    sidebar?.classList.toggle('shadow-2xl', !this.isSidebarOpen)
    separator?.classList.toggle('translate-x-64', !this.isSidebarOpen)

    this.isSidebarOpen = !this.isSidebarOpen
  }

  logOut() {
    this.authCacheService.clearUser()
    document.location.reload()
  }

  getCurrentRoute() {
    return this.router.url
  }
}

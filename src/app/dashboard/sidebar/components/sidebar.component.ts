import { Component, inject } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { RouterLink, Router } from '@angular/router'

import { AuthCacheService, User } from '../../../services'
import { ThemeToggleComponent } from '../../../core'
import { BtnLoginComponent } from '../../../btn-login'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [NgOptimizedImage, RouterLink, ThemeToggleComponent, BtnLoginComponent, CommonModule]
})
export class SidebarComponent {
  private readonly authCacheService = inject(AuthCacheService)
  private readonly router = inject(Router)

  isLogged = this.authCacheService.isAuthenticated()
  user: User | undefined = this.authCacheService.getUser()
  isSidebarOpen = false

  toggleSidebar () {
    const sidebar = document.getElementById('sidebar')!
    const separator = document.getElementById('separator-sidebar')!

    sidebar.classList.toggle('-translate-x-full', this.isSidebarOpen)
    sidebar.classList.toggle('shadow-2xl', !this.isSidebarOpen)
    separator.classList.toggle('translate-x-64', !this.isSidebarOpen)

    this.isSidebarOpen = !this.isSidebarOpen
  }

  logOut () {
    this.authCacheService.clearUser()
    document.location.reload()
  }

  getCurrentRoute () {
    return this.router.url
  }
}

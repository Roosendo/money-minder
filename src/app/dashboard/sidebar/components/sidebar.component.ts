import { Component, inject } from '@angular/core'

import { AuthCacheService, User } from '../../../auth-cache.service'
import { NgOptimizedImage } from '@angular/common'
import { ThemeToggleComponent } from '../../../core/theme-toggle'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [NgOptimizedImage, ThemeToggleComponent]
})
export class SidebarComponent {
  private readonly authCacheService = inject(AuthCacheService)

  isLogged = this.authCacheService.isAuthenticated()
  user: User | undefined = this.authCacheService.getUser()
  isSidebarOpen = false

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar')!
    const separator = document.getElementById('separator-sidebar')!

    sidebar.classList.toggle('-translate-x-full', this.isSidebarOpen)
    sidebar.classList.toggle('shadow-2xl', !this.isSidebarOpen)
    separator.classList.toggle('translate-x-64', !this.isSidebarOpen)

    this.isSidebarOpen = !this.isSidebarOpen
  }
}

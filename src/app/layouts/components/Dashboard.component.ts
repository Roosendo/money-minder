import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SidebarComponent } from '../../dashboard/sidebar'
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  template: `
    <app-sidebar />
    <router-outlet />
  `,
  imports: [RouterOutlet, SidebarComponent, NgOptimizedImage]
})
export class DashboardLayoutComponent {}

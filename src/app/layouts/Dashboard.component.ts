import { NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SidebarComponent } from '../dashboard/sidebar'

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  template: `
    <app-sidebar />
    <router-outlet />
  `,
  imports: [RouterOutlet, SidebarComponent, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {}

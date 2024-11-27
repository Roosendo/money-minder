import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SidebarComponent } from '../dashboard/sidebar'

@Component({
    selector: 'app-dashboard-layout',
    template: `
    <app-sidebar />
    <router-outlet />
  `,
    imports: [RouterOutlet, SidebarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {}

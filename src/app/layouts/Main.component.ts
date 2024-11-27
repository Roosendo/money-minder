import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { FooterComponent } from '@app/core/footer'
import { NavBarComponent } from '@app/core/navbar'

@Component({
    selector: 'app-main-layout',
    template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
  `,
    imports: [NavBarComponent, RouterOutlet, FooterComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {}

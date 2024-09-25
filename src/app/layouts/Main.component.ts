import { NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { FooterComponent } from '@app/core/footer'
import { NavBarComponent } from '@app/core/navbar'

@Component({
  selector: 'app-main-layout',
  standalone: true,
  template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
  `,
  imports: [NavBarComponent, RouterOutlet, FooterComponent, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {}

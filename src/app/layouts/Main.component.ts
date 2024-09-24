import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'

import { NavBarComponent } from '@app/core/navbar'
import { FooterComponent } from '@app/core/footer'

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
export class MainComponent { }

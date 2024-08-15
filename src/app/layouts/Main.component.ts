import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'

import { NavBarComponent } from '../core/navbar'
import { FooterComponent } from '../core/footer'

@Component({
  selector: 'app-main-layout',
  standalone: true,
  template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
  `,
  imports: [NavBarComponent, RouterOutlet, FooterComponent, NgOptimizedImage]
})
export class MainComponent { }

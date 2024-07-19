import { Component } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [NgOptimizedImage, RouterLink]
})
export class HomeComponent {}

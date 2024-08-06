import { Component, inject, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'
import { LoginBttnComponent, NavigationBttnComponent } from '../../core'

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [NgOptimizedImage, RouterLink, LoginBttnComponent, NavigationBttnComponent]
})
export class HomeComponent implements OnInit {
  private titleService = inject(Title)

  ngOnInit () {
    this.titleService.setTitle('Money Minder')
  }
}

import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { NavBarModule } from './core/navbar/navbar.module'
import { FooterModule } from './core/footer/footer.module'
import { HomeModule } from './home/home.module'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarModule, FooterModule, HomeModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'money-minder'
}

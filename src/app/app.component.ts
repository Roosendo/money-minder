import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { NavBarModule } from './navbar/navbar.module'
import { FooterModule } from './footer/footer.module'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarModule, FooterModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'money-minder'
}

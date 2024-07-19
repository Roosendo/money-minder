import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { NavBarComponent } from './core/navbar'
import { FooterModule } from './core/footer/footer.module'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'money-minder'
}

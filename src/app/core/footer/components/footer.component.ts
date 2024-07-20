import { Component } from '@angular/core'
import { ThemeToggleComponent } from '../../theme-toggle'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [ThemeToggleComponent]
})
export class FooterComponent {
  year: number = new Date().getFullYear()
}

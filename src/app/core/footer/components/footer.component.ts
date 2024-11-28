import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ThemeToggleComponent } from '@app/core/theme-toggle'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  year: number = new Date().getFullYear()
}

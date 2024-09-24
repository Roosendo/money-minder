import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-alert-message',
  templateUrl: './am.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertMessageComponent {
  typeAlert = input.required<'warning' | 'success'>()
  alertMessage = input.required<string>()
}

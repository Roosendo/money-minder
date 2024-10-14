import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RemindersStore } from '@app/store'

@Component({
  selector: 'app-reminders',
  standalone: true,
  templateUrl: './reminders.component.html',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemindersComponent {
  readonly store = inject(RemindersStore)
  reminders = this.store.reminders
}

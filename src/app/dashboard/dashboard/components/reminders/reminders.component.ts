import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RemindersStore } from '@app/store'
import { RemindersCardComponent } from "../../../common/reminders-card/reminders-card.component";

@Component({
  selector: 'app-reminders',
  standalone: true,
  templateUrl: './reminders.component.html',
  imports: [RemindersCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemindersComponent {
  readonly store = inject(RemindersStore)
  reminders = this.store.reminders
}

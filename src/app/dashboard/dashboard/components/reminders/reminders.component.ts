import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RemindersCardComponent } from '@app/dashboard/common/reminders-card/reminders-card.component'
import { RemindersStore } from '@app/store'

@Component({
    selector: 'app-reminders',
    templateUrl: './reminders.component.html',
    imports: [RemindersCardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemindersComponent {
  readonly store = inject(RemindersStore)
  reminders = this.store.reminders
}

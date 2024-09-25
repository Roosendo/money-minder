import { AsyncPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ApiCallsService } from '@app/services'

@Component({
  selector: 'app-reminders',
  standalone: true,
  templateUrl: './reminders.component.html',
  imports: [AsyncPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemindersComponent {
  private readonly apiCallsService
  reminders$

  constructor() {
    this.apiCallsService = inject(ApiCallsService)
    this.reminders$ = this.apiCallsService.getReminders()
  }
}

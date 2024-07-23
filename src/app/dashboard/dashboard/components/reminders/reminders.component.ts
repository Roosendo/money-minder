import { Component, inject } from '@angular/core'
import { ApiCallsService } from '../../../../services'
import { AsyncPipe, DatePipe } from '@angular/common'
import { NO_ERRORS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-reminders',
  standalone: true,
  templateUrl: './reminders.component.html',
  imports: [AsyncPipe, DatePipe],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RemindersComponent {
  private readonly apiCallsService = inject(ApiCallsService)
  reminders$ = this.apiCallsService.getReminders()
}

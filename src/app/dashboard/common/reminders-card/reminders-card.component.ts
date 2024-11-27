import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-reminders-card',
    imports: [DatePipe],
    templateUrl: './reminders-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemindersCardComponent {
  title = input.required<string>()
  description = input.required<string>()
  reminder_date = input.required<string>()
}

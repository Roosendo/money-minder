import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import type { Reminder } from '@app/models'

@Component({
    selector: 'app-reminder-delete',
    templateUrl: './rmd.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule]
})
export class ReminderDeleteComponent {
  reminder = input.required<Reminder>()
  delete = output<number>()
  close = output<void>()

  onDelete() {
    this.delete.emit(this.reminder().id)
  }

  onClose() {
    this.close.emit()
  }
}

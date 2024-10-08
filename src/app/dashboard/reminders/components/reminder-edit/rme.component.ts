import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  input,
  output
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import type { EditReminder, Reminder } from '@app/models'

@Component({
  selector: 'app-reminder-edit',
  templateUrl: './rme.component.html',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReminderEditComponent implements OnInit {
  reminder = input.required<Reminder>()
  reminderEdit = {
    id: 0,
    newDescription: '',
    newDate: '',
    newTitle: ''
  }
  closeModal = output<void>()
  save = output<EditReminder>()

  ngOnInit() {
    this.reminderEdit = {
      newDescription: this.reminder().description,
      newDate: this.reminder().reminder_date,
      newTitle: this.reminder().title,
      id: this.reminder().id
    }
  }

  onSave() {
    this.save.emit(this.reminderEdit)
  }

  onCloseModal() {
    this.closeModal.emit()
  }
}

import { Component, input, OnInit, output } from '@angular/core'
import { EditReminder, Reminder } from '../../../../models'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-reminder-edit',
  templateUrl: './rme.component.html',
  standalone: true,
  imports: [FormsModule]
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

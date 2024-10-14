import { DatePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  type OnInit,
  inject
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import {
  AlertMessageComponent,
  NotLoggedComponent,
  SubmitBttnComponent
} from '@app/core'
import type { EditReminder, Reminder } from '@app/models'
import {
  AuthCacheService,
  FormSubmitService
} from '@app/services'
import { timer } from 'rxjs'
import { ReminderDeleteComponent } from './reminder-delete'
import { ReminderEditComponent } from './reminder-edit'
import { RemindersStore } from '@app/store'

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertMessageComponent,
    FormsModule,
    DatePipe,
    ReminderEditComponent,
    ReminderDeleteComponent,
    SubmitBttnComponent,
    NotLoggedComponent
  ]
})
export default class RemindersComponent implements OnInit {
  private readonly title
  private readonly formSubmit
  private readonly cdr
  private readonly authCache
  readonly store = inject(RemindersStore)
  isLogged: boolean
  selectedReminder: Reminder | null = null
  isReminderEditOpen = false
  isReminderDeleteOpen = false
  reminders = this.store.reminders
  amSuccess = false
  amWarning = false
  formReminder = {
    description: '',
    reminderDate: '',
    title: ''
  }

  constructor() {
    this.title = inject(Title)
    this.formSubmit = inject(FormSubmitService)
    this.cdr = inject(ChangeDetectorRef)
    this.authCache = inject(AuthCacheService)
    this.isLogged = this.authCache.isAuthenticated()
  }

  ngOnInit(): void {
    this.title.setTitle('Reminders | Money Minder')
  }

  onNewReminderSubmit() {
    this.formSubmit.reminderSubmit(this.formReminder).subscribe({
      next: () => {
        this.amSuccess = true
        this.store.addReminder({
          description: this.formReminder.description,
          id: 0,
          reminder_date: this.formReminder.reminderDate,
          title: this.formReminder.title
        })
        this.cdr.detectChanges()
        timer(3500).subscribe(() => {
          this.amSuccess = false
          this.cdr.detectChanges()
        })
        this.formReminder = {
          description: '',
          reminderDate: '',
          title: ''
        }
      },
      error: () => {
        this.amWarning = true
        timer(3500).subscribe(() => {
          this.amWarning = false
          this.cdr.detectChanges()
        })
      }
    })
  }

  onCloseModal() {
    this.isReminderEditOpen = false
    this.selectedReminder = null
  }

  openReminderEdit(reminder: Reminder) {
    this.selectedReminder = reminder
    this.isReminderEditOpen = true
  }

  openReminderDelete(reminder: Reminder) {
    this.selectedReminder = reminder
    this.isReminderDeleteOpen = true
  }

  closeReminderDelete() {
    this.isReminderDeleteOpen = false
    this.selectedReminder = null
  }

  onDelete(id: number) {
    this.formSubmit.deleteReminder(id).subscribe({
      next: () => {
        this.closeReminderDelete()
        this.store.removeReminder(id)
        this.cdr.detectChanges()
      },
      error: () => {
        console.error('Error deleting reminder')
      }
    })
  }

  onSave(editReminder: EditReminder) {
    this.formSubmit.editReminder(editReminder).subscribe({
      next: () => {
        this.onCloseModal()
        this.store.editReminder({
          description: editReminder.newDescription,
          id: editReminder.id,
          reminder_date: editReminder.newDate,
          title: editReminder.newTitle
        })
        this.cdr.detectChanges()
      },
      error: () => {
        console.error('Error editing reminder')
      }
    })
  }
}

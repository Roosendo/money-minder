import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject,
  signal
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { NotLoggedComponent, SubmitBttnComponent } from '@app/core'
import type { EditReminder, Reminder } from '@app/models'
import {
  AlertService,
  AuthCacheService,
  FormSubmitService
} from '@app/services'
import { ReminderDeleteComponent } from './reminder-delete'
import { ReminderEditComponent } from './reminder-edit'
import { RemindersStore } from '@app/store'
import { RemindersCardComponent } from '@app/dashboard/common/reminders-card/reminders-card.component'

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReminderEditComponent,
    ReminderDeleteComponent,
    SubmitBttnComponent,
    NotLoggedComponent,
    RemindersCardComponent
  ]
})
export default class RemindersComponent implements OnInit {
  private readonly title
  private readonly formSubmit
  private readonly authCache
  readonly store = inject(RemindersStore)
  isLogged: boolean
  selectedReminder: Reminder | null = null
  isReminderEditOpen = signal<boolean>(false)
  isReminderDeleteOpen = signal<boolean>(false)
  reminders = this.store.reminders
  readonly alertService = inject(AlertService)
  formReminder = {
    description: '',
    reminderDate: '',
    title: ''
  }

  constructor() {
    this.title = inject(Title)
    this.formSubmit = inject(FormSubmitService)
    this.authCache = inject(AuthCacheService)
    this.isLogged = this.authCache.isAuthenticated()
  }

  ngOnInit(): void {
    this.title.setTitle('Reminders | Money Minder')
  }

  onNewReminderSubmit() {
    this.formSubmit.reminderSubmit(this.formReminder).subscribe({
      next: () => {
        this.alertService.showSuccess({ feature: 'reminder', action: 'create' })
        this.store.addReminder({
          description: this.formReminder.description,
          id: 0,
          reminder_date: this.formReminder.reminderDate,
          title: this.formReminder.title
        })
        this.formReminder = {
          description: '',
          reminderDate: '',
          title: ''
        }
      },
      error: () => {
        this.alertService.showError({ feature: 'reminder', action: 'create' })
      }
    })
  }

  onCloseModal() {
    this.isReminderEditOpen.set(false)
    this.selectedReminder = null
  }

  openReminderEdit(reminder: Reminder) {
    this.selectedReminder = reminder
    this.isReminderEditOpen.set(true)
  }

  openReminderDelete(reminder: Reminder) {
    this.selectedReminder = reminder
    this.isReminderDeleteOpen.set(true)
  }

  closeReminderDelete() {
    this.isReminderDeleteOpen.set(false)
    this.selectedReminder = null
  }

  onDelete(id: number) {
    this.formSubmit.deleteReminder(id).subscribe({
      next: () => {
        this.closeReminderDelete()
        this.store.removeReminder(id)
        this.alertService.showInfo({ feature: 'reminder', action: 'delete' })
      },
      error: () => {
        this.alertService.showError({ feature: 'reminder', action: 'delete' })
      }
    })
  }

  onSave(editReminder: EditReminder) {
    this.formSubmit.editReminder(editReminder).subscribe({
      next: () => {
        this.alertService.showInfo({ feature: 'reminder', action: 'update' })
        this.onCloseModal()
        this.store.editReminder({
          description: editReminder.newDescription,
          id: editReminder.id,
          reminder_date: editReminder.newDate,
          title: editReminder.newTitle
        })
      },
      error: () => {
        this.alertService.showError({ feature: 'reminder', action: 'update' })
      }
    })
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  type OnInit,
  inject,
  signal
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
import { RemindersCardComponent } from '@app/dashboard/common/reminders-card/reminders-card.component'

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertMessageComponent,
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
  private readonly cdr
  private readonly authCache
  readonly store = inject(RemindersStore)
  isLogged: boolean
  selectedReminder: Reminder | null = null
  isReminderEditOpen = signal<boolean>(false)
  isReminderDeleteOpen = signal<boolean>(false)
  reminders = this.store.reminders
  amSuccess = signal<boolean>(false)
  amWarning = signal<boolean>(false)
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
        this.amSuccess.set(true)
        this.store.addReminder({
          description: this.formReminder.description,
          id: 0,
          reminder_date: this.formReminder.reminderDate,
          title: this.formReminder.title
        })
        this.cdr.detectChanges()
        timer(3500).subscribe(() => {
          this.amSuccess.set(false)
          this.cdr.detectChanges()
        })
        this.formReminder = {
          description: '',
          reminderDate: '',
          title: ''
        }
      },
      error: () => {
        this.amWarning.set(true)
        timer(3500).subscribe(() => {
          this.amWarning.set(false)
          this.cdr.detectChanges()
        })
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

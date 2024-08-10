import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { AlertMessageComponent, NotLoggedComponent, SubmitBttnComponent } from '../../../core'
import { FormsModule } from '@angular/forms'
import { ApiCallsService, AuthCacheService, FormSubmitService } from '../../../services'
import { AsyncPipe, DatePipe } from '@angular/common'
import { ReminderEditComponent } from './reminder-edit/rme.component'
import { EditReminder, Reminder } from '../../../models'
import { timer } from 'rxjs'
import { ReminderDeleteComponent } from './reminder-delete/rmd.component'

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertMessageComponent,
    FormsModule,
    AsyncPipe,
    DatePipe,
    ReminderEditComponent,
    ReminderDeleteComponent,
    SubmitBttnComponent,
    NotLoggedComponent
  ]
})
export class RemindersComponent implements OnInit {
  private readonly title = inject(Title)
  private readonly apiCalls = inject(ApiCallsService)
  private readonly formSubmit = inject(FormSubmitService)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly authCache = inject(AuthCacheService)
  isLogged = this.authCache.isAuthenticated()
  selectedReminder: Reminder | null = null
  isReminderEditOpen = false
  isReminderDeleteOpen = false
  reminders$ = this.apiCalls.getReminders()
  amSuccess = false
  amWarning = false
  formReminder = {
    description: '',
    reminderDate: '',
    title: ''
  }

  ngOnInit (): void {
    this.title.setTitle('Reminders | Money Minder')
  }

  onNewReminderSubmit () {
    this.formSubmit.reminderSubmit(this.formReminder).subscribe({
      next: () => {
        this.amSuccess = true
        this.reminders$ = this.apiCalls.getReminders()
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

  onCloseModal () {
    this.isReminderEditOpen = false
    this.selectedReminder = null
  }

  openReminderEdit (reminder: Reminder) {
    this.selectedReminder = reminder
    this.isReminderDeleteOpen = true
  }

  openReminderDelete (reminder: Reminder) {
    this.selectedReminder = reminder
    this.isReminderDeleteOpen = true
  }

  closeReminderDelete () {
    this.isReminderDeleteOpen = false
    this.selectedReminder = null
  }

  onDelete (id: number) {
    this.formSubmit.deleteReminder(id).subscribe({
      next: () => {
        this.closeReminderDelete()
        this.reminders$ = this.apiCalls.getReminders()
        this.cdr.detectChanges()
      },
      error: () => {
        console.error('Error deleting reminder')
      }
    })
  }

  onSave (editReminder: EditReminder) {
    this.formSubmit.editReminder(editReminder).subscribe({
      next: () => {
        this.onCloseModal()
        this.reminders$ = this.apiCalls.getReminders()
        this.cdr.detectChanges()
      },
      error: () => {
        console.error('Error editing reminder')
      }
    })
  }
}

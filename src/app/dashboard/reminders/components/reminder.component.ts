import { Component, type OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { NotLoggedComponent, SubmitBttnComponent } from "@app/core";
import type { EditReminder, NewReminder, Reminder, ReminderRecurrence } from "@app/models";
import { AlertService, AuthCacheService, FormSubmitService } from "@app/services";
import { ReminderDeleteComponent } from "./reminder-delete";
import { ReminderEditComponent } from "./reminder-edit";
import { RemindersStore } from "@app/store";
import { RemindersCardComponent } from "@app/dashboard/common/reminders-card/reminders-card.component";

@Component({
  selector: "app-reminder",
  templateUrl: "./reminder.component.html",
  imports: [
    FormsModule,
    ReminderEditComponent,
    ReminderDeleteComponent,
    SubmitBttnComponent,
    NotLoggedComponent,
    RemindersCardComponent,
  ],
})
export default class RemindersComponent implements OnInit {
  private readonly title;
  private readonly formSubmit;
  private readonly authCache;
  readonly store = inject(RemindersStore);
  isLogged;
  selectedReminder: Reminder | null = null;
  isReminderEditOpen = signal<boolean>(false);
  isReminderDeleteOpen = signal<boolean>(false);
  reminders = this.store.reminders;
  readonly alertService = inject(AlertService);
  readonly recurrenceOptions: ReminderRecurrence[] = ["none", "monthly", "yearly"];
  formReminder: NewReminder = {
    title: "",
    amount: null,
    dueAt: "",
    recurrence: "none",
  };

  constructor() {
    this.title = inject(Title);
    this.formSubmit = inject(FormSubmitService);
    this.authCache = inject(AuthCacheService);
    this.isLogged = this.authCache.isLoggedIn;
  }

  ngOnInit(): void {
    this.title.setTitle("Reminders | Money Minder");
  }

  onNewReminderSubmit() {
    this.formSubmit.reminderSubmit(this.formReminder).subscribe({
      next: (reminder) => {
        this.alertService.showSuccess({ feature: "reminder", action: "create" });
        this.store.addReminder(reminder);
        this.formReminder = {
          title: "",
          amount: null,
          dueAt: "",
          recurrence: "none",
        };
      },
      error: () => {
        this.alertService.showError({ feature: "reminder", action: "create" });
      },
    });
  }

  onCloseModal() {
    this.isReminderEditOpen.set(false);
    this.selectedReminder = null;
  }

  openReminderEdit(reminder: Reminder) {
    this.selectedReminder = reminder;
    this.isReminderEditOpen.set(true);
  }

  openReminderDelete(reminder: Reminder) {
    this.selectedReminder = reminder;
    this.isReminderDeleteOpen.set(true);
  }

  closeReminderDelete() {
    this.isReminderDeleteOpen.set(false);
    this.selectedReminder = null;
  }

  onDelete(id: string) {
    this.formSubmit.deleteReminder(id).subscribe({
      next: () => {
        this.closeReminderDelete();
        this.store.removeReminder(id);
        this.alertService.showInfo({ feature: "reminder", action: "delete" });
      },
      error: () => {
        this.alertService.showError({ feature: "reminder", action: "delete" });
      },
    });
  }

  onSave(editReminder: EditReminder) {
    this.formSubmit.editReminder(editReminder).subscribe({
      next: (reminder) => {
        this.alertService.showInfo({ feature: "reminder", action: "update" });
        this.onCloseModal();
        this.store.editReminder(reminder);
      },
      error: () => {
        this.alertService.showError({ feature: "reminder", action: "update" });
      },
    });
  }
}

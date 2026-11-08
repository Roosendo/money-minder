import { Component, type OnInit, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import type { EditReminder, Reminder, ReminderRecurrence, ReminderStatus } from "@app/models";

@Component({
  selector: "app-reminder-edit",
  templateUrl: "./rme.component.html",
  imports: [FormsModule],
})
export class ReminderEditComponent implements OnInit {
  reminder = input.required<Reminder>();
  reminderEdit: EditReminder = {
    id: "",
    title: "",
    amount: null,
    dueAt: "",
    recurrence: "none",
    status: "pending",
  };
  closeModal = output<void>();
  save = output<EditReminder>();
  readonly recurrenceOptions: ReminderRecurrence[] = ["none", "monthly", "yearly"];
  readonly statusOptions: ReminderStatus[] = ["pending", "done"];

  ngOnInit() {
    this.reminderEdit = {
      id: this.reminder().id,
      title: this.reminder().title,
      amount: this.reminder().amount,
      // datetime-local expects `YYYY-MM-DDTHH:mm`, while the API returns an
      // ISO timestamp with seconds and timezone.
      dueAt: this.reminder().due_at.slice(0, 16),
      recurrence: this.reminder().recurrence,
      status: this.reminder().status,
    };
  }

  onSave() {
    this.save.emit(this.reminderEdit);
  }

  onCloseModal() {
    this.closeModal.emit();
  }
}

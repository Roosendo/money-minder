import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import type { ReminderRecurrence, ReminderStatus } from "@app/models";

@Component({
  selector: "app-reminders-card",
  imports: [DatePipe, CurrencyPipe],
  templateUrl: "./reminders-card.component.html",
})
export class RemindersCardComponent {
  title = input.required<string>();
  amount = input<number | null>(null);
  dueAt = input.required<string>();
  recurrence = input.required<ReminderRecurrence>();
  status = input.required<ReminderStatus>();

  recurrenceLabel(recurrence: ReminderRecurrence): string {
    switch (recurrence) {
      case "monthly":
        return "Mensual";
      case "yearly":
        return "Anual";
      default:
        return "Una sola vez";
    }
  }

  statusLabel(status: ReminderStatus): string {
    return status === "done" ? "Completado" : "Pendiente";
  }
}

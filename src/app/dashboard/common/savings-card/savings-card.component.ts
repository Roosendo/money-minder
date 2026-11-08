import { CurrencyPipe } from "@angular/common";
import { Component, input } from "@angular/core";
import type { Saving } from "@app/models";

@Component({
  selector: "app-savings-card",
  imports: [CurrencyPipe],
  templateUrl: "./savings-card.component.html",
})
export class SavingsCardComponent {
  saving = input.required<Saving>();

  calculateProgress(saving: Saving): number {
    const progress = Math.round((saving.current_amount / saving.target_amount) * 100);
    return progress > 100 ? 100 : progress;
  }
}

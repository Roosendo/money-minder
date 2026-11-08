import { CurrencyPipe } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { FinancialSummaryStore } from "@app/store";

@Component({
  selector: "app-financial-summary",
  templateUrl: "./fs.component.html",
  imports: [CurrencyPipe],
})
export class FinancialSummaryComponent {
  private readonly store = inject(FinancialSummaryStore);
  financialSummary = this.store.financialSummary;
  balance = computed(() =>
    (this.financialSummary().totalEntries - this.financialSummary().totalExits).toFixed(2),
  );
}

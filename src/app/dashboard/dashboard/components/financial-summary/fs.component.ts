import { AsyncPipe, CurrencyPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { FinancialSummaryStore } from '@app/store'

@Component({
  selector: 'app-financial-summary',
  templateUrl: './fs.component.html',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialSummaryComponent {
  private readonly store = inject(FinancialSummaryStore)
  financialSummary = this.store.financialSummary
  balance = computed(() => (this.financialSummary().totalEntries - this.financialSummary().totalExits).toFixed(2))
}

import { AsyncPipe, CurrencyPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import type { FSClean } from '@app/models'
import { ApiCallsService } from '@app/services'
import { type Observable, map } from 'rxjs'

@Component({
  selector: 'app-financial-summary',
  templateUrl: './fs.component.html',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialSummaryComponent {
  private readonly apiCalls
  financialSummary$: Observable<FSClean>
  balance$: Observable<string>

  constructor() {
    this.apiCalls = inject(ApiCallsService)
    this.financialSummary$ = this.apiCalls.getFinancialSummary()
    this.balance$ = this.financialSummary$.pipe(
      map((data) => (data.totalEntries - data.totalExits).toFixed(2))
    )
  }
}

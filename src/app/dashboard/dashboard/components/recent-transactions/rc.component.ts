import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ApiCallsService } from '@app/services'

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  templateUrl: './rc.component.html',
  imports: [AsyncPipe, DatePipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentTransactionsComponent {
  private readonly apiCalls
  transactions$

  constructor() {
    this.apiCalls = inject(ApiCallsService)
    this.transactions$ = this.apiCalls.getRecentTransactions()
  }
}

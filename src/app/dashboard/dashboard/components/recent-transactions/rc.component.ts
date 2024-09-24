import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ApiCallsService } from '../../../../services'
import { AsyncPipe, DatePipe } from '@angular/common'

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  templateUrl: './rc.component.html',
  imports: [AsyncPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentTransactionsComponent {
  private readonly apiCalls
  transactions$

  constructor () {
    this.apiCalls = inject(ApiCallsService)
    this.transactions$ = this.apiCalls.getRecentTransactions()
  }
}

import { Component, inject } from '@angular/core'
import { ApiCallsService } from '../../../../services'
import { AsyncPipe, DatePipe } from '@angular/common'

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  templateUrl: './rc.component.html',
  imports: [AsyncPipe, DatePipe]
})
export class RecentTransactionsComponent {
  private readonly apiCalls = inject(ApiCallsService)
  transactions$ = this.apiCalls.getRecentTransactions()
}

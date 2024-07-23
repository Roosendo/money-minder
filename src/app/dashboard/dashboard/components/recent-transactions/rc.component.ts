import { Component, inject } from '@angular/core'
import { ApiCallsService } from '../../../../services';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  templateUrl: './rc.component.html',
  imports: [AsyncPipe]
})
export class RecentTransactionsComponent {
  private readonly apiCalls = inject(ApiCallsService)
  transactions$ = this.apiCalls.getRecentTransactions()
}

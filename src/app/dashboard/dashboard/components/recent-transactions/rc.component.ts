import { CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TransactionsStore } from '@app/store'

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  templateUrl: './rc.component.html',
  imports: [DatePipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentTransactionsComponent {
  readonly store = inject(TransactionsStore)
  recentTransactions = this.store.recentTransactions
}

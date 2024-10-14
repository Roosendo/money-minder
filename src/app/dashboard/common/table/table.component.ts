import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  type OnChanges,
  type OnInit,
  type Signal,
  inject,
  input
} from '@angular/core'
import type { Transaction } from '@app/models'
import { TransactionsStore } from '@app/store'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  triggerUpdate = input.required<boolean>()
  type = input.required<'entries' | 'exits'>()

  readonly store = inject(TransactionsStore)

  dataTransactions!: Signal<Transaction[]>

  ngOnInit(): void {
    this.dataTransactions = this.getDataTransactions()
  }

  private getDataTransactions() {
    return this.type() === 'entries'
      ? this.store.entries
      : this.store.exits
  }
}

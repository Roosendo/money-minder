import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { BarChartComponent } from '@app/charts'
import { CashFlowStore } from '@app/store'

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  templateUrl: './cf.component.html',
  imports: [BarChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashFlowComponent {
  readonly store = inject(CashFlowStore)
  cashFlow = this.store.cashFlow
}

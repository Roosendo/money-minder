import { AsyncPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { BarChartComponent } from '@app/charts'
import { ApiCallsService } from '@app/services'

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  templateUrl: './cf.component.html',
  imports: [BarChartComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashFlowComponent {
  private readonly apiCalls
  cashFlow$

  constructor() {
    this.apiCalls = inject(ApiCallsService)
    this.cashFlow$ = this.apiCalls.getCashFlow()
  }
}

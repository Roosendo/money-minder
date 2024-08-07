import { Component, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'

import { BarChartComponent } from '../../../../charts'
import { ApiCallsService } from '../../../../services'

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  templateUrl: './cf.component.html',
  imports: [BarChartComponent, AsyncPipe]
})
export class CashFlowComponent {
  private readonly apiCalls = inject(ApiCallsService)
  cashFlow$ = this.apiCalls.getCashFlow()
}

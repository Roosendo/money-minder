import { Component, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { Observable, map } from 'rxjs'
import { FSClean } from '../../../../models'
import { ApiCallsService } from '../../../../services'

@Component({
  selector: 'app-financial-summary',
  templateUrl: './fs.component.html',
  standalone: true,
  imports: [AsyncPipe]
})
export class FinancialSummaryComponent {
  private readonly apiCalls
  financialSummary$: Observable<FSClean>
  balance$: Observable<string>

  constructor () {
    this.apiCalls = inject(ApiCallsService)
    this.financialSummary$ = this.apiCalls.getFinancialSummary()
    this.balance$ = this.financialSummary$.pipe(map((data) => (data.totalEntries - data.totalExits).toFixed(2)))
  }
}

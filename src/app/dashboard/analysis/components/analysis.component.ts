import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { Title } from '@angular/platform-browser'

import { ApiCallsService, AuthCacheService } from '../../../services'
import { PieChartComponent } from '../../../charts'
import { Observable } from 'rxjs'
import { Summary, TransactionChart } from '../../../models'
import { NotLoggedComponent } from '../../../core'

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [AsyncPipe, CommonModule, PieChartComponent, NotLoggedComponent],
  templateUrl: './analysis.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AnalysisComponent implements OnInit {
  private readonly titleService
  private readonly apiCalls
  private readonly authCache
  isLogged: boolean

  currentMonth = new Date().toLocaleString('default', { month: 'long' })
  currentMonthNumber = new Date().getMonth() + 1
  currentYear = new Date().getFullYear()
  currentDate = new Date().toISOString().substring(0, 7)
  summary$!: Observable<Summary>
  monthlyEntries$!: Observable<TransactionChart[]>
  monthlyExits$!: Observable<TransactionChart[]>

  constructor () {
    this.titleService = inject(Title)
    this.apiCalls = inject(ApiCallsService)
    this.authCache = inject(AuthCacheService)
    this.isLogged = this.authCache.isAuthenticated()
  }

  ngOnInit () {
    this.titleService.setTitle('Analysis | Money Minder')
    this.getData()
  }

  onMonthChange (event: Event) {
    const input = event.target as HTMLInputElement
    this.currentDate = input.value
    const [ year, month ] = this.currentDate.split('-').map(Number)
    this.currentYear = year
    this.currentMonthNumber = month
    this.currentMonth = new Date(year, month - 1).toLocaleString('default', { month: 'long' })

    this.getData()
  }

  private getData () {
    this.summary$ = this.apiCalls.getAnalysisSummary(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))
    this.monthlyEntries$ = this.apiCalls.getMonthlyEntries(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))
    this.monthlyExits$ = this.apiCalls.getMonthlyExits(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))
  }
}

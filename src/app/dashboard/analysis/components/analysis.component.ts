import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { Title } from '@angular/platform-browser'

import { ApiCallsService } from '../../../services'
import { PieChartComponent } from '../../../charts'

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [AsyncPipe, CommonModule, PieChartComponent],
  templateUrl: './analysis.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisComponent implements OnInit {
  private readonly titleService = inject(Title)
  private readonly apiCalls = inject(ApiCallsService)
  currentMonth = new Date().toLocaleString('default', { month: 'long' })
  currentMonthNumber = new Date().getMonth() + 1
  currentYear = new Date().getFullYear()
  currentDate = new Date().toISOString().substring(0, 7)
  summary$ = this.apiCalls.getAnalysisSummary(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))
  monthlyEntries$ = this.apiCalls.getMonthlyEntries(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))
  monthlyExits$ = this.apiCalls.getMonthlyExits(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))

  ngOnInit() {
    this.titleService.setTitle('Analysis | Money Minder')
  }

  onMonthChange(event: Event) {
    const input = event.target as HTMLInputElement
    this.currentDate = input.value
    const [ year, month ] = this.currentDate.split('-').map(Number)
    this.currentYear = year
    this.currentMonthNumber = month
    this.currentMonth = new Date(year, month - 1).toLocaleString('default', { month: 'long' })

    // getting again
    this.summary$ = this.apiCalls.getAnalysisSummary(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))
    this.monthlyEntries$ = this.apiCalls.getMonthlyEntries(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))
    this.monthlyExits$ = this.apiCalls.getMonthlyExits(this.currentYear, this.currentMonthNumber.toString().padStart(2, '0'))
  }
}

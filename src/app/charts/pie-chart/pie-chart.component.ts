import {
  type AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  type OnDestroy,
  input
} from '@angular/core'
import type { TransactionChart } from '@app/models'
import { Chart, registerables } from 'chart.js'
import { createGraphic } from '../utils'

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent implements AfterViewChecked, OnDestroy {
  dataTC = input.required<TransactionChart[]>()
  text = input.required<string>()
  chartId = input.required<string>()
  private chartInstance: Chart<'pie', number[], string> | undefined

  constructor() {
    Chart.register(...registerables)
  }

  ngAfterViewChecked() {
    this.initializeChart()
  }

  ngOnDestroy() {
    this.destroyChart()
  }

  initializeChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }

    const canvas = document.querySelector(
      `#${this.chartId()}`
    ) as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    if (ctx && this.dataTC()) {
      const categories = this.dataTC().map((item) => item.category)
      const totalAmounts = this.dataTC().map((item) => item.total)
      this.chartInstance = createGraphic(
        ctx,
        categories,
        totalAmounts,
        this.text()
      )
    }
  }

  destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
      this.chartInstance = undefined
    }
  }
}

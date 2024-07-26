import { ChangeDetectionStrategy, Component, input, AfterViewInit } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts'
import { TransactionChart } from '../../models'
import { Chart, registerables } from 'chart.js'
import { createGraphic } from '../utils'

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent implements AfterViewInit {
  dataTC = input.required<TransactionChart[]>()
  text = input.required<string>()
  private ctx!: CanvasRenderingContext2D | null
  private canvas!: HTMLCanvasElement

  constructor () {
    Chart.register(...registerables)
  }

  ngAfterViewInit () {
    this.initializeChart()
  }

  initializeChart() {
    if (this.dataTC()) {
      this.canvas = document.querySelector('#pieChart') as HTMLCanvasElement
      this.ctx = this.canvas.getContext('2d')
      const categories = this.dataTC().map((item) => item.category)
      const totalAmounts = this.dataTC().map((item) => item.total)

      if (this.ctx) {
        createGraphic(this.ctx, categories, totalAmounts, this.text())
      }
    }
  }
}

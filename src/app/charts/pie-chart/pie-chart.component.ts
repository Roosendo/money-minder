import { ChangeDetectionStrategy, Component, input, AfterViewInit } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts'
import { MainCategories } from '../../models'
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
  dataMC = input.required<MainCategories[]>()
  private ctx!: CanvasRenderingContext2D | null
  private canvas!: HTMLCanvasElement

  constructor () {
    Chart.register(...registerables)
  }

  ngAfterViewInit () {
    this.initializeChart()
  }

  initializeChart() {
    if (this.dataMC()) {
      this.canvas = document.querySelector('#pieChart') as HTMLCanvasElement
      this.ctx = this.canvas.getContext('2d')
      const categories = this.dataMC().map((item) => item.category)
      const totalAmounts = this.dataMC().map((item) => item.total)
      const labelsToShow = this.dataMC().map((item) => item.category)

      if (this.ctx && labelsToShow)
        createGraphic(this.ctx, categories, totalAmounts, 'Categorías principales')
    }
  }
}

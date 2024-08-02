import { ChangeDetectionStrategy, Component, input, AfterViewInit } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts'
import { CashFLow } from '../../models'
import { Chart, registerables } from 'chart.js'
import { createGraphicBar } from '../utils'

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements AfterViewInit {
  dataCF = input.required<CashFLow[]>()
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D | null
  private months: Record<string, string> = {
    '01': 'Enero',
    '02': 'Febrero',
    '03': 'Marzo',
    '04': 'Abril',
    '05': 'Mayo',
    '06': 'Junio',
    '07': 'Julio',
    '08': 'Agosto',
    '09': 'Septiembre',
    '10': 'Octubre',
    '11': 'Noviembre',
    '12': 'Diciembre'
  }

  constructor () {
    Chart.register(...registerables)
  }

  ngAfterViewInit () {
    this.initializeChart()
  }

  initializeChart () {
    if (this.dataCF()) {
      const ingresosMensuales = this.dataCF().map((cf) => cf.total_ingresos)
      const egresosMensuales = this.dataCF().map((cf) => cf.total_egresos)
      const saldoMensual = ingresosMensuales.map(
        (ingreso, index) => ingreso - egresosMensuales[index]
      )
      const labelsToShow = this.dataCF().map((item) => this.months[item.month] || item.month)

      this.canvas = document.querySelector('#barChart') as HTMLCanvasElement
      this.ctx = this.canvas.getContext('2d')
      if (this.ctx) { createGraphicBar(this.ctx, labelsToShow, ingresosMensuales, egresosMensuales, saldoMensual) }
    }
  }
}

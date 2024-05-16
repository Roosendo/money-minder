import { Chart } from 'chart.js/auto'

export const createGraphic = (
  ctx: HTMLCanvasElement,
  categorias: string[],
  cantidades: number[],
  text: string
) => {
  const chart = Chart.getChart(ctx)
  if (chart) {
    chart.destroy()
  }

  const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categorias,
      datasets: [{
        label: text,
        data: cantidades,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(233, 30, 99, 0.6)',
          'rgba(0, 250, 154, 0.6)',
          'rgba(255, 87, 34, 0.6)',
          'rgba(63, 81, 181, 0.6)',
          'rgba(165, 105, 189, 0.6)',
          'rgba(88, 214, 141, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(233, 30, 99, 1)',
          'rgba(0, 250, 154, 1)',
          'rgba(255, 87, 34, 1)',
          'rgba(63, 81, 181, 1)',
          'rgba(165, 105, 189, 1)',
          'rgba(88, 214, 141, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      animation: true,
      plugins: {
        tooltip: {
          enabled: true
        }
      }
    }
  })

  return myChart
}

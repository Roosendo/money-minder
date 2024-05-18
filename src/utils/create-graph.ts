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

  Chart.defaults.font.family = 'Onest Variable'

  const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categorias,
      datasets: [{
        label: text,
        data: cantidades,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(233, 30, 99, 0.6)',
          'rgba(0, 250, 154, 0.6)',
          'rgba(255, 87, 34, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(233, 30, 99, 1)',
          'rgba(0, 250, 154, 1)',
          'rgba(255, 87, 34, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      animation: {
        animateRotate: true,
        animateScale: true
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        }
      }
    }
  })

  return myChart
}

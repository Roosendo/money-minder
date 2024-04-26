export function showAndHideAlert (alertElement: HTMLDivElement, timeout: number = 2000) {
  alertElement.classList.remove('hidden')
  alertElement.classList.add('flex')
  setTimeout(() => {
    alertElement.classList.remove('flex')
    alertElement.classList.add('hidden')
  }, timeout)
}

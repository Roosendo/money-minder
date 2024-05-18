export const isValidDate = (dateString: string): boolean => {
  // Expresión regular para validar formato de fecha yyyy-mm-dd
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false

  // Validar si la fecha es válida en JS (puede ser una fecha inválida como 2022-02-30)
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

export const isValidAmount = (amount: any): boolean => {
  // Validar si la cantidad es un número positivo
  if (typeof amount === 'number' && amount >= 0) {
    return true
  }

  // Si no es un número, intentar convertirlo a número con 2 decimales
  const parsedAmount = parseFloat(amount)
  if (!isNaN(parsedAmount) && parsedAmount >= 0) {
    return true
  }

  return false
}

export const isValidDate = (dateString: string): boolean => {
  // Expresión regular para validar formato de fecha yyyy-mm-dd
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false

  // Validar si la fecha es válida en JS (puede ser una fecha inválida como 2022-02-30)
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

export const isValidISODateTime = (dateTimeString: string) => {
  // Expresión regular para validar el formato YYYY-MM-DDTHH:MM
  const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

  // Comprobar si la cadena coincide con la expresión regular
  if (!isoDateTimeRegex.test(dateTimeString)) return false

  // Si coincide, intentar crear un objeto Date con la cadena
  const date = new Date(dateTimeString + 'Z')

  // Validar que el objeto Date es válido y coincide con la cadena original
  const isValidDate = date.toISOString().slice(0, 16) === dateTimeString

  return isValidDate
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

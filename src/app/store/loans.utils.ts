import type { EditPayment, NewPayment, Payments } from '@app/models'

/**
 * Updates a specific payment within a list of payments.
 * @param payments The array of payments to update.
 * @param editPayment The payment details to update.
 * @returns A new array of payments with the updated payment.
 */
export const updateSpecificPayment = (
  payments: Payments[],
  editPayment: EditPayment
): Payments[] => {
  return payments.map((payment) =>
    payment.id === editPayment.paymentId
      ? {
          ...payment,
          payment_amount: editPayment.paymentAmount,
          payment_date: editPayment.paymentDate
        }
      : payment
  )
}

/**
 * Calculates the difference between two payment amounts.
 * @param originalAmount The original payment amount.
 * @param newAmount The new payment amount.
 * @returns The difference between the new and original amounts.
 */
export const calculatePaymentDifference = (
  originalAmount: number,
  newAmount: number
): number => {
  return newAmount - originalAmount
}

/**
 * Adds a new payment to a list of payments.
 * @param payments The array of payments to update.
 * @param newPayment The payment details to add.
 * @returns A new array of payments with the added payment.
 */
export const addNewPayment = (
  payments: Payments[],
  newPayment: NewPayment
): Payments[] => {
  // Crear un objeto de pago con los datos de `newPayment`
  const newPaymentEntry: Payments = {
    id: Date.now(), // Generar un ID único
    payment_amount: newPayment.paymentAmount,
    payment_date: newPayment.paymentDate
  }

  // Agregar el nuevo pago y limitar a cinco pagos
  const updatedPayments = [newPaymentEntry, ...payments]
  if (updatedPayments.length > 5) updatedPayments.pop() // Mantener solo los últimos cinco

  return updatedPayments
}


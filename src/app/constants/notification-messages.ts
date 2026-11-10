import type { NotificationMessages } from "@app/models";

export const NOTIFICATION_MESSAGES: NotificationMessages = {
  entry: {
    create: {
      success: "Ingreso agregado exitosamente 🎉",
      error: "Error al agregar el ingreso ❌",
    },
    update: {
      success: "Ingreso actualizado exitosamente 🔄",
      error: "Error al actualizar el ingreso ❌",
    },
    delete: {
      success: "Ingreso eliminado exitosamente 🗑️",
      error: "Error al eliminar el ingreso ❌",
    },
    fetch: {
      error: "Error al obtener los ingresos ⚠️",
    },
  },
  exit: {
    create: {
      success: "Transacción de salida agregada exitosamente 💸",
      error: "Error al agregar la transacción de salida ❌",
    },
    update: {
      success: "Transacción de salida actualizada exitosamente 🔄",
      error: "Error al actualizar la transacción de salida ❌",
    },
    delete: {
      success: "Transacción de salida eliminada exitosamente 🗑️",
      error: "Error al eliminar la transacción de salida ❌",
    },
    fetch: {
      error: "Error al obtener las transacciones de salida ⚠️",
    },
  },
  saving: {
    create: {
      success: "Ahorro agregado exitosamente 💰",
      error: "Error al agregar el ahorro ❌",
    },
    update: {
      success: "Ahorro actualizado exitosamente 🔄",
      error: "Error al actualizar el ahorro ❌",
    },
    delete: {
      success: "Ahorro eliminado exitosamente 🗑️",
      error: "Error al eliminar el ahorro ❌",
    },
    fetch: {
      error: "Error al obtener los ahorros ⚠️",
    },
  },
  reminder: {
    create: {
      success: "Recordatorio configurado exitosamente ⏰",
      error: "Error al configurar el recordatorio ❌",
    },
    update: {
      success: "Recordatorio actualizado exitosamente 🔄",
      error: "Error al actualizar el recordatorio ❌",
    },
    delete: {
      success: "Recordatorio eliminado exitosamente 🗑️",
      error: "Error al eliminar el recordatorio ❌",
    },
    fetch: {
      error: "Error al obtener los recordatorios ⚠️",
    },
  },
  creditCard: {
    create: {
      success: "Tarjeta de crédito agregada exitosamente 💳",
      error: "Error al agregar la tarjeta de crédito ❌",
    },
    update: {
      success: "Tarjeta de crédito actualizada exitosamente 🔄",
      error: "Error al actualizar la tarjeta de crédito ❌",
    },
    delete: {
      success: "Tarjeta de crédito eliminada exitosamente 🗑️",
      error: "Error al eliminar la tarjeta de crédito ❌",
    },
    fetch: {
      error: "Error al obtener las tarjetas de crédito ⚠️",
    },
  },
  loan: {
    create: {
      success: "Préstamo agregado exitosamente 💵",
      error: "Error al agregar el préstamo ❌",
    },
    update: {
      success: "Préstamo actualizado exitosamente 🔄",
      error: "Error al actualizar el préstamo ❌",
    },
    delete: {
      success: "Préstamo eliminado exitosamente 🗑️",
      error: "Error al eliminar el préstamo ❌",
    },
    fetch: {
      error: "Error al obtener los préstamos ⚠️",
    },
  },
  payment: {
    create: {
      success: "Pago agregado exitosamente 💲",
      error: "Error al agregar el pago ❌",
    },
    update: {
      success: "Pago actualizado exitosamente 🔄",
      error: "Error al actualizar el pago ❌",
    },
    delete: {
      success: "Pago eliminado exitosamente 🗑️",
      error: "Error al eliminar el pago ❌",
    },
    fetch: {
      error: "Error al obtener los pagos ⚠️",
    },
  },
  account: {
    create: {
      success: "Cuenta creada exitosamente 🏦",
      error: "Error al crear la cuenta ❌",
    },
    update: {
      success: "Cuenta actualizada exitosamente 🔄",
      error: "Error al actualizar la cuenta ❌",
    },
    delete: {
      success: "Cuenta archivada exitosamente 🗂️",
      error: "Error al archivar la cuenta ❌",
    },
    fetch: {
      error: "Error al obtener las cuentas ⚠️",
    },
  },
  transfer: {
    create: {
      success: "Transferencia realizada exitosamente 🔁",
      error: "Error al realizar la transferencia ❌",
    },
    update: {
      success: "Transferencia actualizada exitosamente 🔄",
      error: "Error al actualizar la transferencia ❌",
    },
    delete: {
      success: "Transferencia revertida exitosamente 🗑️",
      error: "Error al revertir la transferencia ❌",
    },
    fetch: {
      error: "Error al obtener las transferencias ⚠️",
    },
  },
  debitCard: {
    create: {
      success: "Tarjeta de débito agregada exitosamente 💳",
      error: "Error al agregar la tarjeta de débito ❌",
    },
    update: {
      success: "Tarjeta de débito actualizada exitosamente 🔄",
      error: "Error al actualizar la tarjeta de débito ❌",
    },
    delete: {
      success: "Tarjeta de débito eliminada exitosamente 🗑️",
      error: "Error al eliminar la tarjeta de débito ❌",
    },
    fetch: {
      error: "Error al obtener las tarjetas de débito ⚠️",
    },
  },
} as const;

export type NotificationType = 'success' | 'error' | 'warning' | 'info'
export type FeatureType = 'loan' | 'payment' | 'entry' | 'exit' | 'saving' | 'reminder' | 'creditCard'
export type ActionType = 'create' | 'update' | 'delete' | 'fetch'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  duration?: number
}

export interface NotificationConfig {
  feature: FeatureType
  action: ActionType
  customMessage?: string
}

interface ActionMessages {
  success?: string
  error?: string
}

interface FeatureMessages {
  create: ActionMessages
  update: ActionMessages
  delete: ActionMessages
  fetch: ActionMessages
}

export type NotificationMessages = {
  [K in FeatureType]: FeatureMessages
}

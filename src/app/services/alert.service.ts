import { Injectable, inject } from '@angular/core'
import { NotificationService } from '@app/services'
import { NOTIFICATION_MESSAGES } from '@app/constants'
import type { NotificationConfig } from '@app/models'

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private notificationService = inject(NotificationService)

  showSuccess(config: NotificationConfig): void {
    const message = config.customMessage ?? 
      NOTIFICATION_MESSAGES[config.feature][config.action]?.success
    
    if (message) {
      this.notificationService.show(message, 'success')
    }
  }

  showError(config: NotificationConfig): void {
    const message = config.customMessage ?? 
      NOTIFICATION_MESSAGES[config.feature][config.action]?.error
    
    if (message) {
      this.notificationService.show(message, 'error')
    }
  }

  showWarning(config: NotificationConfig): void {
    const message = config.customMessage ?? 
      NOTIFICATION_MESSAGES[config.feature][config.action]?.error

    if (message) {
      this.notificationService.show(message, 'warning')
    }
  }

  showInfo(config: NotificationConfig): void {
    const message = config.customMessage ?? 
      NOTIFICATION_MESSAGES[config.feature][config.action]?.success

    if (message) {
      this.notificationService.show(message, 'info')
    }
  }
}

import { Injectable, signal } from '@angular/core'
import type { Notification, NotificationType } from '@app/models'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([])

  getNotifications() {
    return this.notifications
  }

  show(message: string, type: NotificationType = 'info', duration = 3500) {
    const id = crypto.randomUUID()
    const notification: Notification = { id, message, type, duration }
    
    this.notifications.update(notifications => [...notifications, notification])

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }
  }

  remove(id: string) {
    this.notifications.update(notifications => 
      notifications.filter(notification => notification.id !== id)
    )
  }
}
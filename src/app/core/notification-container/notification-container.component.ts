import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NotificationComponent } from '@app/core/alert-message'
import { NotificationService } from '@app/services'

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './notification-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationContainerComponent {
  protected notificationService = inject(NotificationService)
  protected notifications = this.notificationService.getNotifications()
}
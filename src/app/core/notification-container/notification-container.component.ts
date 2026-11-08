import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { NotificationComponent } from "@app/core/alert-message";
import { NotificationService } from "@app/services";

@Component({
  selector: "app-notification-container",
  imports: [NotificationComponent],
  templateUrl: "./notification-container.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationContainerComponent {
  protected notificationService = inject(NotificationService);
  protected notifications = this.notificationService.getNotifications();
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { Notification } from '@app/models'

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `:host {
      display: block;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
  notification = input.required<Notification>()

  containerClasses = computed(() => {
    const baseClasses = 'border-l-4'
    
    const typeClasses = {
      success: 'border-green-500 bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400',
      error: 'border-red-500 bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400',
      warning: 'border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-gray-800 dark:text-yellow-400',
      info: 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
    }

    return `${baseClasses} ${typeClasses[this.notification().type]}`
  })
}

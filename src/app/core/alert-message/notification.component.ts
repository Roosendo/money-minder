import { Component, computed, input } from "@angular/core";

import type { Notification } from "@app/models";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  imports: [],
  styles: [
    `
      :host {
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
      }
    `,
  ],
})
export class NotificationComponent {
  notification = input.required<Notification>();

  containerClasses = computed(() => {
    const baseClasses = "border border-rule-2";

    const typeClasses = {
      success: "bg-sheet text-ink",
      error: "bg-sheet text-danger",
      warning: "bg-sheet text-ink",
      info: "bg-sheet text-ink",
    };

    return `${baseClasses} ${typeClasses[this.notification().type]}`;
  });
}

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NotificationComponent } from "./core";
import { NotificationContainerComponent } from "./core/notification-container/notification-container.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NotificationComponent, NotificationContainerComponent],
  templateUrl: "./app.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}

import { Component, input } from "@angular/core";
import { LoaderComponent } from "../loader";

@Component({
  selector: "app-work-in-progress",
  imports: [LoaderComponent],
  templateUrl: "./work-in-progress.component.html",
})
export class WorkInProgressComponent {
  featureName = input.required<string>();
}

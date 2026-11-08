import { Component, input } from "@angular/core";

@Component({
  selector: "app-submit-bttn",
  imports: [],
  templateUrl: "./submit-bttn.component.html",
  styles: [":host { display: inline-block; }"],
})
export class SubmitBttnComponent {
  text = input.required<string>();
  variant = input<"primary" | "quiet">("primary");
}

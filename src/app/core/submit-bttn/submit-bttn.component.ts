import { Component, input } from "@angular/core";

@Component({
  selector: "app-submit-bttn",
  imports: [],
  templateUrl: "./submit-bttn.component.html",
})
export class SubmitBttnComponent {
  text = input.required<string>();
}

import { Component } from "@angular/core";
import { ThemeToggleComponent } from "@app/core/theme-toggle";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  imports: [ThemeToggleComponent],
})
export class FooterComponent {
  year: number = new Date().getFullYear();
}

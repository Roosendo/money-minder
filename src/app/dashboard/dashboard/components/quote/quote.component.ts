import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { QuoteStore } from "@app/store";

@Component({
  selector: "app-quote",
  templateUrl: "./quote.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteComponent {
  readonly store = inject(QuoteStore);
  quote = this.store.quote;
}

import { AsyncPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { QuoteStore } from '@app/store'

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteComponent {
  private readonly store = inject(QuoteStore)
  quote = this.store.quote
}

import { AsyncPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ApiCallsService } from '@app/services'

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteComponent {
  private readonly apiCalls
  quote$

  constructor() {
    this.apiCalls = inject(ApiCallsService)
    this.quote$ = this.apiCalls.getQuote()
  }
}

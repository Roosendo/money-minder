import { Component, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { ApiCallsService } from '../../../../services'

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  standalone: true,
  imports: [AsyncPipe]
})
export class QuoteComponent {
  private readonly apiCalls = inject(ApiCallsService)
  quote$ = this.apiCalls.getQuote()
}

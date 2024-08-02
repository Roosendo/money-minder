import { Component, inject, Input, OnChanges } from '@angular/core'
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common'

import { ApiCallsService } from '../../../../services'

@Component({
  selector: 'app-table-exits',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [AsyncPipe, CommonModule, DatePipe]
})
export class ExitsTableComponent implements OnChanges {
  @Input()
    triggerUpdate = false

  private readonly apiCalls = inject(ApiCallsService)

  lastExits$ = this.apiCalls.getLastExits()

  ngOnChanges () {
    if (this.triggerUpdate) {
      this.lastExits$ = this.apiCalls.getLastExits()
    }
  }
}

import { Component, inject, Input, OnChanges } from '@angular/core'
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common'

import { ApiCallsService } from '../../../../services'

@Component({
  selector: 'app-table-entries',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [AsyncPipe, CommonModule, DatePipe]
})
export class EntriesTableComponent implements OnChanges {
  @Input()
  triggerUpdate = false

  private readonly apiCalls = inject(ApiCallsService)

  lastEntries$ = this.apiCalls.getLastEntries()

  ngOnChanges() {
    if (this.triggerUpdate) {
      this.lastEntries$ = this.apiCalls.getLastEntries()
    }
  }
}

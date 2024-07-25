import { Component, EventEmitter, inject, Input, OnChanges } from '@angular/core'
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common'

import { ApiCallsService } from '../../../../services'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [AsyncPipe, CommonModule, DatePipe]
})
export class TableComponent implements OnChanges {
  @Input()
  triggerUpdate = false

  private readonly apiCalls = inject(ApiCallsService)

  newEntry = new EventEmitter<boolean>()
  lastEntries$ = this.apiCalls.getLastEntries()

  ngOnChanges() {
    if (this.triggerUpdate) {
      this.lastEntries$ = this.apiCalls.getLastEntries()
    }
  }
}

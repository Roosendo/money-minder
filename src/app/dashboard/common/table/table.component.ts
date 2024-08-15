import { AsyncPipe, CommonModule, DatePipe } from '@angular/common'
import { Component, inject, input, OnChanges, OnInit } from '@angular/core'
import { ApiCallsService } from '../../../services'
import { Transaction } from '../../../models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [AsyncPipe, CommonModule, DatePipe]
})
export class TableComponent implements OnInit, OnChanges {
  triggerUpdate = input.required<boolean>()
  type = input.required<'entries' | 'exits'>()

  private readonly apiCalls

  dataTransactions$!: Observable<Transaction[]>

  constructor () {
    this.apiCalls = inject(ApiCallsService)
  }

  ngOnInit (): void {
    this.dataTransactions$ = this.getDataTransactions()
  }

  ngOnChanges () {
    if (this.triggerUpdate()) {
      this.dataTransactions$ = this.getDataTransactions()
    }
  }

  private getDataTransactions () {
    return this.type() === 'entries' ? this.apiCalls.getLastEntries() : this.apiCalls.getLastExits()
  }
}

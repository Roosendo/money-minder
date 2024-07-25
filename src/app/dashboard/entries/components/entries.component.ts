import { Component, OnInit, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { FormEntriesComponent } from './form'
import { TableComponent } from './table/table.component'

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  standalone: true,
  imports: [FormEntriesComponent, TableComponent]
})
export class EntriesComponent implements OnInit {
  private readonly titleService = inject(Title)
  triggerUpdate = false

  ngOnInit() {
    this.titleService.setTitle('Entries | Money Minder')
  }

  onFormSubmitted() {
    this.triggerUpdate = !this.triggerUpdate
  }
}

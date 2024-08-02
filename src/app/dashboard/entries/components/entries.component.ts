import { Component, OnInit, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { TableComponent, FormComponent } from '../../common'

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  standalone: true,
  imports: [FormComponent, TableComponent]
})
export class EntriesComponent implements OnInit {
  private readonly titleService = inject(Title)
  triggerUpdate = false

  ngOnInit () {
    this.titleService.setTitle('Entries | Money Minder')
  }

  onFormSubmitted () {
    this.triggerUpdate = !this.triggerUpdate
  }
}

import { Component, OnInit, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { TableComponent, FormComponent } from '../../common'

@Component({
  selector: 'app-exits',
  templateUrl: './exits.component.html',
  standalone: true,
  imports: [FormComponent, TableComponent]
})
export class ExitsComponent implements OnInit {
  private readonly titleService = inject(Title)
  triggerUpdate = false

  ngOnInit () {
    this.titleService.setTitle('Exits | Money Minder')
  }

  onFormSubmitted () {
    this.triggerUpdate = !this.triggerUpdate
  }
}

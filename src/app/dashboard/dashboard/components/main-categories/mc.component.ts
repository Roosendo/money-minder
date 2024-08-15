import { Component, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'

import { PieChartComponent } from '../../../../charts'
import { ApiCallsService } from '../../../../services'

@Component({
  selector: 'app-main-categories',
  standalone: true,
  templateUrl: './mc.component.html',
  imports: [PieChartComponent, AsyncPipe]
})
export class MainCategoriesComponent {
  private readonly apiCalls
  mainCategories$

  constructor () {
    this.apiCalls = inject(ApiCallsService)
    this.mainCategories$ = this.apiCalls.getMainCategories()
  }
}

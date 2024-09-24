import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'

import { PieChartComponent } from '@app/charts'
import { ApiCallsService } from '@app/services'

@Component({
  selector: 'app-main-categories',
  standalone: true,
  templateUrl: './mc.component.html',
  imports: [PieChartComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainCategoriesComponent {
  private readonly apiCalls
  mainCategories$

  constructor () {
    this.apiCalls = inject(ApiCallsService)
    this.mainCategories$ = this.apiCalls.getMainCategories()
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { PieChartComponent } from '@app/charts'
import { CategoriesStore } from '@app/store'

@Component({
  selector: 'app-main-categories',
  standalone: true,
  templateUrl: './mc.component.html',
  imports: [PieChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainCategoriesComponent {
  readonly store = inject(CategoriesStore)
  categories = this.store.categories
}

import { CurrencyPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { SavingsStore } from '@app/store'

@Component({
  selector: 'app-goal',
  standalone: true,
  templateUrl: './goal.component.html',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalComponent {
  readonly store = inject(SavingsStore)
  savings = this.store.savings
}

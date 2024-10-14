import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { SavingsCardComponent } from '@app/dashboard/common/savings-card/savings-card.component'
import { SavingsStore } from '@app/store'

@Component({
  selector: 'app-goal',
  standalone: true,
  templateUrl: './goal.component.html',
  imports: [SavingsCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalComponent {
  readonly store = inject(SavingsStore)
  savings = this.store.savings
}

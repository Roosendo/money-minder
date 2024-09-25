import { AsyncPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ApiCallsService } from '@app/services'

@Component({
  selector: 'app-goal',
  standalone: true,
  templateUrl: './goal.component.html',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalComponent {
  private readonly apiCalls
  goals$

  constructor() {
    this.apiCalls = inject(ApiCallsService)
    this.goals$ = this.apiCalls.getSavings()
  }
}

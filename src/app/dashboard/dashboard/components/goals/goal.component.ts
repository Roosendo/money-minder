import { Component, inject } from '@angular/core'
import { ApiCallsService } from '../../../../services'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-goal',
  standalone: true,
  templateUrl: './goal.component.html',
  imports: [AsyncPipe]
})
export class GoalComponent {
  private readonly apiCalls = inject(ApiCallsService)
  goals$ = this.apiCalls.getSavings()
}

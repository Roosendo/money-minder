import { ChangeDetectionStrategy, Component } from '@angular/core'
import { WorkInProgressComponent } from '@app/core'

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [WorkInProgressComponent],
  templateUrl: './loans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoansComponent {

}

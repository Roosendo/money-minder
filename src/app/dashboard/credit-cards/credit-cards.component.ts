import { ChangeDetectionStrategy, Component } from '@angular/core'
import { WorkInProgressComponent } from '@app/core/work-in-progress'

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [WorkInProgressComponent],
  templateUrl: './credit-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardsComponent {

}

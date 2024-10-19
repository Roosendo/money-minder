import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { LoaderComponent } from '../loader'

@Component({
  selector: 'app-work-in-progress',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './work-in-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkInProgressComponent {
  featureName = input.required<string>()
}

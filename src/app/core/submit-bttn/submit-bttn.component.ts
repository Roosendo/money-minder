import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-submit-bttn',
  standalone: true,
  imports: [],
  templateUrl: './submit-bttn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmitBttnComponent {
  text = input.required<string>()
}

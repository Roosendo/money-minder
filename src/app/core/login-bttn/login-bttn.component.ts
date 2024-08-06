import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-login-bttn',
  templateUrl: './login-bttn.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class LoginBttnComponent {
  text = input.required<string>()
}

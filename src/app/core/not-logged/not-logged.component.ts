import { ChangeDetectionStrategy, Component } from '@angular/core'
import { LoginBttnComponent } from '../login-bttn/login-bttn.component'

@Component({
  selector: 'app-not-logged',
  standalone: true,
  imports: [LoginBttnComponent],
  templateUrl: './not-logged.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotLoggedComponent {}

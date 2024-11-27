import { ChangeDetectionStrategy, Component } from '@angular/core'
import { LoginBttnComponent } from '../login-bttn/login-bttn.component'

@Component({
    selector: 'app-not-logged',
    imports: [LoginBttnComponent],
    templateUrl: './not-logged.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotLoggedComponent {}

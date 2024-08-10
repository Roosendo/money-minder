import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { TableComponent, FormComponent } from '../../common'
import { AuthCacheService } from '../../../services'
import { NotLoggedComponent } from '../../../core'

@Component({
  selector: 'app-exits',
  templateUrl: './exits.component.html',
  standalone: true,
  imports: [FormComponent, TableComponent, NotLoggedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExitsComponent implements OnInit {
  private readonly titleService = inject(Title)
  private readonly authCache = inject(AuthCacheService)
  isLogged = this.authCache.isAuthenticated()
  triggerUpdate = false

  ngOnInit () {
    this.titleService.setTitle('Exits | Money Minder')
  }

  onFormSubmitted () {
    this.triggerUpdate = !this.triggerUpdate
  }
}

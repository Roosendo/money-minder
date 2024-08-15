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
export default class ExitsComponent implements OnInit {
  private readonly titleService
  private readonly authCache
  isLogged: boolean
  triggerUpdate = false

  constructor () {
    this.titleService = inject(Title)
    this.authCache = inject(AuthCacheService)
    this.isLogged = this.authCache.isAuthenticated()
  }

  ngOnInit () {
    this.titleService.setTitle('Exits | Money Minder')
  }

  onFormSubmitted () {
    this.triggerUpdate = !this.triggerUpdate
  }
}

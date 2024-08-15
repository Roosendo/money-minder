import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { TableComponent, FormComponent } from '../../common'
import { NotLoggedComponent } from '../../../core'
import { AuthCacheService } from '../../../services'

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  standalone: true,
  imports: [FormComponent, TableComponent, NotLoggedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class EntriesComponent implements OnInit {
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
    this.titleService.setTitle('Entries | Money Minder')
  }

  onFormSubmitted () {
    this.triggerUpdate = !this.triggerUpdate
  }
}

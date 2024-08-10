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
export class EntriesComponent implements OnInit {
  private readonly titleService = inject(Title)
  private readonly authCache = inject(AuthCacheService)
  isLogged = this.authCache.isAuthenticated()
  triggerUpdate = false

  ngOnInit () {
    this.titleService.setTitle('Entries | Money Minder')
  }

  onFormSubmitted () {
    this.triggerUpdate = !this.triggerUpdate
  }
}

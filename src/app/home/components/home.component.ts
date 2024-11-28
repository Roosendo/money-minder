import { NgOptimizedImage } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject
} from '@angular/core'
import { Title } from '@angular/platform-browser'
import { RouterLink } from '@angular/router'
import { LoginBttnComponent, NavigationBttnComponent } from '@app/core'
import content from '../content.json'

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    NgOptimizedImage,
    RouterLink,
    LoginBttnComponent,
    NavigationBttnComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private titleService
  sections = content.sections
  services = content.services
  termsConds = content.termsConds

  constructor() {
    this.titleService = inject(Title)
  }

  ngOnInit() {
    this.titleService.setTitle('Money Minder')
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject,
  input
} from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'

@Component({
  selector: 'app-navigation-bttn',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation-bttn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBttnComponent implements OnInit {
  text = input.required<string>()
  navigateTo = input.required<string>()
  fragment = input<string>()
  private activatedRoute

  constructor() {
    this.activatedRoute = inject(ActivatedRoute)
  }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      if (fragment) this.jumpToSection(fragment)
    })
  }

  jumpToSection(section: string | null) {
    if (section)
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
  }
}

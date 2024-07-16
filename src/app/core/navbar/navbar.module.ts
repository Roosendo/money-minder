import { NgModule } from '@angular/core'
import { RouterLink } from '@angular/router'

import { NavBarComponent } from './components/navbar.component'

@NgModule({
  declarations: [NavBarComponent],
  imports: [RouterLink],
  exports: [NavBarComponent]
})
export class NavBarModule {}

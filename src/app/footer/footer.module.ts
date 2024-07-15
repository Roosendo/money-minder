import { NgModule } from '@angular/core'

import { FooterComponent } from './components/footer.component'
import { ThemeToggleModule } from '../theme-toggle/theme-toggle.module'

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
  imports: [ThemeToggleModule]
})
export class FooterModule {}

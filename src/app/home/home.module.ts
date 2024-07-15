import { NgModule } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'

import { HomeComponent } from './components/home.component'

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  imports: [NgOptimizedImage]
})
export class HomeModule {}

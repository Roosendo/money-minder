import { NgModule } from '@angular/core'

import { LoginComponent } from './components/login.component'

@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule {}

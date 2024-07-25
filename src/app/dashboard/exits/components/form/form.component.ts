import { Component, EventEmitter, Output, inject, ChangeDetectorRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { timer } from 'rxjs'

import { AlertMessageComponent } from '../../../../core'
import { FormSubmitService } from '../../../../services'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [FormsModule, AlertMessageComponent],
})
export class FormComponent {
  @Output()
  formSubmitted = new EventEmitter<void>()

  private readonly formSubmit = inject(FormSubmitService)
  private readonly cdr = inject(ChangeDetectorRef)
  am_success = false
  am_category = false
  am_warning = false

  formData = {
    date: '',
    amount: 0,
    category: '',
    description: ''
  }

  onSubmit() {
    if (!this.formData.category) {
      this.am_category = true
      timer(3500).subscribe(() => {
        this.am_category = false
        this.cdr.detectChanges()
      })

      return
    }

    this.formSubmit.exitSubmit(this.formData).subscribe({
      next: () => {
        this.am_success = true
        timer(3500).subscribe(() => {
          this.am_success = false
          this.cdr.detectChanges()
        })

        this.formData = { date: '', amount: 0, category: '', description: '' }
        this.formSubmitted.emit()
      },
      error: () => {
        this.am_warning = true
        timer(3500).subscribe(() => {
          this.am_warning = false
          this.cdr.detectChanges()
        })
      }
    })
  }
}

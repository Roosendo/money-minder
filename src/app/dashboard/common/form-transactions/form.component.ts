import { ChangeDetectionStrategy, Component, output, inject, ChangeDetectorRef, input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { timer } from 'rxjs'
import { FormSubmitService } from '../../../services'
import { AlertMessageComponent, SubmitBttnComponent } from '../../../core'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AlertMessageComponent, SubmitBttnComponent]
})
export class FormComponent {
  formSubmitted = output<void>()
  type = input.required<'entries' | 'exits'>()

  private readonly formSubmit
  private readonly cdr

  am_success = false
  am_category = false
  am_warning = false

  formData = {
    date: '',
    amount: 0,
    category: '',
    description: ''
  }

  constructor () {
    this.formSubmit = inject(FormSubmitService)
    this.cdr = inject(ChangeDetectorRef)
  }

  private submitEntriesForm () {
    this.formSubmit.entrySubmit(this.formData).subscribe({
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

  private submitExitsForm () {
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

  onSubmit () {
    if (!this.formData.category) {
      this.am_category = true
      timer(3500).subscribe(() => {
        this.am_category = false
        this.cdr.detectChanges()
      })

      return
    }

    if (this.type() === 'entries') {
      this.submitEntriesForm()
    } else if (this.type() === 'exits') {
      this.submitExitsForm()
    }
  }
}

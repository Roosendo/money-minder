import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AlertMessageComponent, SubmitBttnComponent } from '@app/core'
import { AuthCacheService, FormSubmitService } from '@app/services'
import { timer } from 'rxjs'
import categoriesJson from './categories.json'
import { TransactionsStore } from '@app/store'

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
  categories = categoriesJson

  private readonly formSubmit
  private readonly cdr
  readonly store = inject(TransactionsStore)
  private readonly authCache = inject(AuthCacheService)

  am_success = false
  am_category = false
  am_warning = false

  formData = {
    date: '',
    amount: 0,
    category: '',
    description: '',
    id: Math.floor(Math.random() * 1000000),
    user_email: this.authCache.getUser()?.email
  }

  constructor() {
    this.formSubmit = inject(FormSubmitService)
    this.cdr = inject(ChangeDetectorRef)
  }

  private submitEntriesForm() {
    this.formSubmit.entrySubmit(this.formData).subscribe({
      next: () => {
        this.am_success = true
        timer(3500).subscribe(() => {
          this.am_success = false
          this.cdr.detectChanges()
        })

        this.store.addEntry(this.formData)
        this.formData = { date: '', amount: 0, category: '', description: '', id: Math.floor(Math.random() * 1000000), user_email: this.authCache.getUser()?.email }
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

  private submitExitsForm() {
    this.formSubmit.exitSubmit(this.formData).subscribe({
      next: () => {
        this.am_success = true
        timer(3500).subscribe(() => {
          this.am_success = false
          this.cdr.detectChanges()
        })

        this.store.addExit(this.formData)
        this.formData = { date: '', amount: 0, category: '', description: '', id: Math.floor(Math.random() * 1000000), user_email: this.authCache.getUser()?.email }
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

  onSubmit() {
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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
  signal
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

  am_success = signal<boolean>(false)
  am_category = signal<boolean>(false)
  am_warning = signal<boolean>(false)

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
        this.am_success.set(true)
        timer(3500).subscribe(() => {
          this.am_success.set(false)
          this.cdr.detectChanges()
        })

        this.store.addEntry(this.formData)
        this.formData = { date: '', amount: 0, category: '', description: '', id: Math.floor(Math.random() * 1000000), user_email: this.authCache.getUser()?.email }
        this.formSubmitted.emit()
      },
      error: () => {
        this.am_warning.set(true)
        timer(3500).subscribe(() => {
          this.am_warning.set(false)
          this.cdr.detectChanges()
        })
      }
    })
  }

  private submitExitsForm() {
    this.formSubmit.exitSubmit(this.formData).subscribe({
      next: () => {
        this.am_success.set(true)
        timer(3500).subscribe(() => {
          this.am_success.set(false)
          this.cdr.detectChanges()
        })

        this.store.addExit(this.formData)
        this.formData = { date: '', amount: 0, category: '', description: '', id: Math.floor(Math.random() * 1000000), user_email: this.authCache.getUser()?.email }
        this.formSubmitted.emit()
      },
      error: () => {
        this.am_warning.set(true)
        timer(3500).subscribe(() => {
          this.am_warning.set(false)
          this.cdr.detectChanges()
        })
      }
    })
  }

  onSubmit() {
    if (!this.formData.category) {
      this.am_category.set(true)
      timer(3500).subscribe(() => {
        this.am_category.set(false)
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

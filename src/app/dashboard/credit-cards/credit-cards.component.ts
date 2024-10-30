import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, type Signal, computed, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AlertMessageComponent, SubmitBttnComponent } from '@app/core'
import type { Purchases } from '@app/models'
import { FormSubmitService } from '@app/services'
import { CreditCardsStore } from '@app/store'
import { timer } from 'rxjs'

interface TemplateFormCC {
  name: FormControl<string>
  cut_off_date: FormControl<number>
  payment_due_date: FormControl<number>
}

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [ReactiveFormsModule, SubmitBttnComponent, DatePipe, CurrencyPipe, CommonModule, AlertMessageComponent],
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardsComponent {
  private formSubmit = inject(FormSubmitService)
  readonly store = inject(CreditCardsStore)
  creditCards = this.store.creditCards
  purchases = this.store.purchases
  currentMonth = computed(() => new Date().getMonth() + 1)
  currentYear = computed(() => new Date().getFullYear())
  total = computed(() => this.purchases().reduce((acc, purchase) => acc + purchase.amount, 0))

  am_success = signal(false)
  am_warning = signal(false)
  am_Name = signal(false)
  am_CutOff = signal(false)
  am_PaymentDue = signal(false)

  formData: Signal<FormGroup> = computed(() =>
    new FormGroup<TemplateFormCC>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      cut_off_date: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      payment_due_date: new FormControl(0, {
        nonNullable: true, validators: [Validators.required]
      })
    })
  )

  days = Array.from({ length: 31 }, (_, i) => i + 1)

  expandedCard: number | null = null
  toggleCardExpansion(index: number): void {
    this.expandedCard = this.expandedCard === index ? null : index
  }

  getPurchasesForCard(cardId: number): Purchases[] {
    return this.purchases().filter(p => p.credit_card_id === cardId)
  }

  onSubmit(): void {
    if (this.formData().invalid) {
      if (!this.formData().get('name')?.value) {
        this.am_Name.set(true)
        timer(3500).subscribe(() => this.am_Name.set(false))
      }
      if (!this.formData().get('cut_off_date')?.value) {
        this.am_CutOff.set(true)
        timer(3500).subscribe(() => this.am_CutOff.set(false))
      }
      if (!this.formData().get('payment_due_date')?.value) {
        this.am_PaymentDue.set(true)
        timer(3500).subscribe(() => this.am_PaymentDue.set(false))
      }
      return
    }

    this.formSubmit.creditCardSubmit({
      cutOffDate: this.formData().get('cut_off_date')?.value,
      name: this.formData().get('name')?.value,
      paymentDueDate: this.formData().get('payment_due_date')?.value
    })
      .subscribe({
        next: () => {
          this.am_success.set(true)
          timer(3500).subscribe(() => this.am_success.set(false))
          this.formData().reset()
          this.store.addCreditCard({
            credit_card_id: Math.floor(Math.random() * 1000000),
            cut_off_date: this.formData().get('cut_off_date')?.value,
            name: this.formData().get('name')?.value,
            payment_due_date: this.formData().get('payment_due_date')?.value
          })
        },
        error: () => this.handleError()
      })
  }

  private handleError(): void {
    this.am_warning.set(true)
    timer(3500).subscribe(() => this.am_warning.set(false))
  }
}

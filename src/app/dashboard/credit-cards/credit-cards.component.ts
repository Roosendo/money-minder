import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, type Signal, computed, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { SubmitBttnComponent } from '@app/core'
import type { CreditCards, Purchases } from '@app/models'
import { AlertService, FormSubmitService } from '@app/services'
import { CreditCardsStore } from '@app/store'
import { ModalDeleteCcComponent } from './modal-delete-cc'

interface TemplateFormCC {
  name: FormControl<string>
  cut_off_date: FormControl<number>
  payment_due_date: FormControl<number>
}

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SubmitBttnComponent,
    DatePipe,
    CurrencyPipe,
    CommonModule,
    ModalDeleteCcComponent
  ],
  templateUrl: './credit-cards.component.html',
  styleUrl: './credit-cards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardsComponent {
  private formSubmit = inject(FormSubmitService)
  private title = inject(Title)
  readonly store = inject(CreditCardsStore)
  readonly alertService = inject(AlertService)
  creditCards = this.store.creditCards
  purchases = this.store.purchases
  currentMonth = computed(() => new Date().getMonth() + 1)
  currentYear = computed(() => new Date().getFullYear())
  total = computed(() => this.purchases().reduce((acc, purchase) => acc + purchase.amount, 0))
  selectedCard: CreditCards | null = null
  modalDelete = signal(false)

  constructor() {
    this.title.setTitle('Credit Cards | Money Minder')
  }

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

  openModalDelete(card: CreditCards): void {
    this.selectedCard = card
    this.modalDelete.set(true)
  }

  closeModalDelete(): void {
    this.modalDelete.set(false)
    this.selectedCard = null
  }

  deleteCard(id: number): void {
    this.formSubmit.deleteCreditCard(id).subscribe({
      next: () => {
        this.store.deleteCreditCard(id)
        this.closeModalDelete()
      },
      error: () => {
        this.handleError()
        this.closeModalDelete()
      }
    })
  }

  onSubmit(): void {
    if (this.formData().invalid) {
      if (!this.formData().get('name')?.value) {
        this.alertService.showWarning({ feature: 'creditCard', action: 'create', customMessage: 'Antes debes agregar un nombre' })
      }
      if (!this.formData().get('cut_off_date')?.value) {
        this.alertService.showWarning({ feature: 'creditCard', action: 'create', customMessage: 'Antes debes agregar una fecha de corte' })
      }
      if (!this.formData().get('payment_due_date')?.value) {
        this.alertService.showWarning({ feature: 'creditCard', action: 'create', customMessage: 'Antes debes agregar una fecha de pago' })
      }
      return
    }

    this.formSubmit.creditCardSubmit({
      cutOffDate: this.formData().get('cut_off_date')?.value,
      name: this.formData().get('name')?.value,
      paymentDueDate: this.formData().get('payment_due_date')?.value
    })
      .subscribe({
        next: (response) => {
          this.alertService.showSuccess({ feature: 'creditCard', action: 'create' })
          this.store.addCreditCard({
            credit_card_id: response,
            cut_off_date: this.formData().get('cut_off_date')?.value,
            name: this.formData().get('name')?.value,
            payment_due_date: this.formData().get('payment_due_date')?.value
          })
          this.formData().reset()
        },
        error: () => this.handleError()
      })
  }

  private handleError(): void {
    this.alertService.showError({ feature: 'creditCard', action: 'create' })
  }
}

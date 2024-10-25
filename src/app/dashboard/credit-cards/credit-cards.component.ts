import { CurrencyPipe, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SubmitBttnComponent } from '@app/core'
import { CreditCardsStore } from '@app/store'

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [FormsModule, SubmitBttnComponent, DatePipe, CurrencyPipe],
  templateUrl: './credit-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardsComponent {
  readonly store = inject(CreditCardsStore)
  creditCards = this.store.creditCards
  purchases = this.store.purchases
  currentMonth = new Date().getMonth() + 1
  currentYear = new Date().getFullYear()
  total = computed(() => this.purchases().reduce((acc, purchase) => acc + purchase.amount, 0))

  formData = {
    name: '',
    cutOffDate: '',
    paymentDueDate: ''
  }

  days = Array.from({ length: 31 }, (_, i) => i + 1)

  expandedCard: number | null = null
  toggleCardExpansion(index: number): void {
    this.expandedCard = this.expandedCard === index ? null : index
    this.store.updatePurchases(index)
  }
}

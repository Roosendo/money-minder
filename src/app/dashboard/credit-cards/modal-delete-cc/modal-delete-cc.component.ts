import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import type { CreditCards } from '@app/models'

@Component({
    selector: 'app-modal-delete-cc',
    imports: [FormsModule],
    templateUrl: './modal-delete-cc.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDeleteCcComponent {
  creditCard = input.required<CreditCards>()
  delete = output<number>()
  close = output<void>()

  onDelete() {
    this.delete.emit(this.creditCard().credit_card_id)
  }

  onClose() {
    this.close.emit()
  }
}

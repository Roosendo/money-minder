import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import type { Saving } from '@app/models'

@Component({
    selector: 'app-goal-modal-delete',
    templateUrl: './gmd.component.html',
    imports: [FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalModalDeleteComponent {
  saving = input.required<Saving>()
  readonly delete = output<number>()
  readonly closeModal = output<void>()

  onDelete() {
    this.delete.emit(this.saving().id)
  }

  onCloseModal() {
    this.closeModal.emit()
  }
}

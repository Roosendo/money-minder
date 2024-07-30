import { Component, input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Saving } from '../../../../models'

@Component({
  selector: 'app-goal-modal-delete',
  templateUrl: './gmd.component.html',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalModalDeleteComponent {
  saving = input.required<Saving>()
  @Output() delete = new EventEmitter<number>()
  @Output() closeModal = new EventEmitter<void>()

  onDelete() {
    this.delete.emit(this.saving().id)
  }

  onCloseModal() {
    this.closeModal.emit()
  }
}

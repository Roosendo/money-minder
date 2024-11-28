import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  type OnInit,
  Output,
  input
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import type { EditSaving, Saving } from '@app/models'

@Component({
  selector: 'app-goal-modal-edit',
  templateUrl: './gme.component.html',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalModalEditComponent implements OnInit {
  goal = input.required<Saving>()
  @Output() save = new EventEmitter<EditSaving>()
  @Output() closeModal = new EventEmitter<void>()
  formEdit: EditSaving = {
    id: 0,
    newSavingName: '',
    newTarget: 0,
    newCurrentAmount: 0,
    newEndDate: ''
  }

  ngOnInit() {
    this.formEdit = {
      newSavingName: this.goal().name,
      newTarget: this.goal().target_amount,
      newCurrentAmount: this.goal().current_amount,
      newEndDate: this.goal().end_date,
      id: this.goal().id
    }
  }

  onSave() {
    this.save.emit(this.formEdit)
  }

  onCloseModal() {
    this.closeModal.emit()
  }
}

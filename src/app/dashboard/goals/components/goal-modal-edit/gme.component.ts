import { Component, EventEmitter, type OnInit, Output, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import type { EditSaving, Saving } from "@app/models";

@Component({
  selector: "app-goal-modal-edit",
  templateUrl: "./gme.component.html",
  imports: [FormsModule],
})
export class GoalModalEditComponent implements OnInit {
  goal = input.required<Saving>();
  @Output() save = new EventEmitter<EditSaving>();
  @Output() closeModal = new EventEmitter<void>();
  formEdit: EditSaving = {
    id: "",
    newSavingName: "",
    newTarget: 0,
    newCurrentAmount: 0,
    newTargetDate: "",
  };

  ngOnInit() {
    this.formEdit = {
      id: this.goal().id,
      newSavingName: this.goal().name,
      newTarget: this.goal().target_amount,
      newCurrentAmount: this.goal().current_amount,
      newTargetDate: this.goal().target_date ?? "",
    };
  }

  onSave() {
    this.save.emit(this.formEdit);
  }

  onCloseModal() {
    this.closeModal.emit();
  }
}

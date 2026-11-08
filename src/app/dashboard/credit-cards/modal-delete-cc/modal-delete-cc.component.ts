import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import type { CreditCards } from "@app/models";

@Component({
  selector: "app-modal-delete-cc",
  imports: [FormsModule],
  templateUrl: "./modal-delete-cc.component.html",
})
export class ModalDeleteCcComponent {
  creditCard = input.required<CreditCards>();
  delete = output<string>();
  close = output<void>();

  onDelete() {
    this.delete.emit(this.creditCard().id);
  }

  onClose() {
    this.close.emit();
  }
}

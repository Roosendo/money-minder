import { Component, HostListener, input, output } from "@angular/core";
import type { CreditCards } from "@app/models";

@Component({
  selector: "app-modal-delete-cc",
  templateUrl: "./modal-delete-cc.component.html",
})
export class ModalDeleteCcComponent {
  creditCard = input.required<CreditCards>();
  delete = output<string>();
  close = output<void>();

  @HostListener("document:keydown.escape")
  onEscape(): void {
    this.close.emit();
  }

  onDelete() {
    this.delete.emit(this.creditCard().id);
  }

  onClose() {
    this.close.emit();
  }
}

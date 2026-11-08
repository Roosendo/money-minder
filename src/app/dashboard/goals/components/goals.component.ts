import { Component, type OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";

import { NotLoggedComponent, SubmitBttnComponent } from "@app/core";
import type { EditSaving, NewSaving, Saving } from "@app/models";
import { AlertService, AuthCacheService, FormSubmitService } from "@app/services";
import { GoalModalDeleteComponent } from "./goal-modal-delete";
import { GoalModalEditComponent } from "./goal-modal-edit";
import { SavingsStore } from "@app/store";
import { SavingsCardComponent } from "@app/dashboard/common/savings-card/savings-card.component";

@Component({
  selector: "app-goals",
  templateUrl: "./goals.component.html",
  imports: [
    FormsModule,
    GoalModalEditComponent,
    GoalModalDeleteComponent,
    SubmitBttnComponent,
    NotLoggedComponent,
    SavingsCardComponent,
  ],
})
export default class GoalsComponent implements OnInit {
  formData: NewSaving = {
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
  };
  isModalEditOpen = signal<boolean>(false);
  isModalDeleteOpen = signal<boolean>(false);
  selectedSaving: Saving | null = null;
  private readonly formSubmit;
  private readonly title;
  private readonly authCache;
  isLogged;
  readonly store = inject(SavingsStore);
  readonly alertService = inject(AlertService);
  savings = this.store.savings;

  constructor() {
    this.formSubmit = inject(FormSubmitService);
    this.title = inject(Title);
    this.authCache = inject(AuthCacheService);
    this.isLogged = this.authCache.isLoggedIn;
  }

  ngOnInit(): void {
    this.title.setTitle("Savings | Money Minder");
  }

  onNewSavingSubmit() {
    this.formSubmit.savingSubmit(this.formData).subscribe({
      next: (saving) => {
        this.alertService.showSuccess({ feature: "saving", action: "create" });
        this.store.addSaving(saving);
        this.formData = {
          name: "",
          targetAmount: 0,
          currentAmount: 0,
          targetDate: "",
        };
      },
      error: () => {
        this.alertService.showError({ feature: "saving", action: "create" });
      },
    });
  }

  openEditModal(saving: Saving) {
    this.isModalEditOpen.set(true);
    this.selectedSaving = saving;
  }

  closeEditModal() {
    this.isModalEditOpen.set(false);
    this.selectedSaving = null;
  }

  openDeleteModal(saving: Saving) {
    this.isModalDeleteOpen.set(true);
    this.selectedSaving = saving;
  }

  closeDeleteModal() {
    this.isModalDeleteOpen.set(false);
    this.selectedSaving = null;
  }

  editSaving(saving: EditSaving) {
    this.formSubmit.editSaving(saving).subscribe({
      next: (updated) => {
        this.closeEditModal();
        this.alertService.showInfo({ feature: "saving", action: "update" });
        this.store.editSaving(updated);
      },
      error: () => {
        this.alertService.showError({ feature: "saving", action: "update" });
      },
    });
  }

  deleteSaving(id: string) {
    this.formSubmit.deleteSaving(id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.store.removeSaving(id);
        this.alertService.showInfo({ feature: "saving", action: "delete" });
      },
      error: () => {
        this.alertService.showError({ feature: "saving", action: "delete" });
      },
    });
  }
}

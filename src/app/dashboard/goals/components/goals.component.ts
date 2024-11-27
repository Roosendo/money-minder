import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject,
  signal
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'

import { NotLoggedComponent, SubmitBttnComponent } from '@app/core'
import type { EditSaving, Saving } from '@app/models'
import {
  AlertService,
  AuthCacheService,
  FormSubmitService
} from '@app/services'
import { GoalModalDeleteComponent } from './goal-modal-delete'
import { GoalModalEditComponent } from './goal-modal-edit'
import { SavingsStore } from '@app/store'
import { SavingsCardComponent } from '@app/dashboard/common/savings-card/savings-card.component'

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
    imports: [
        FormsModule,
        GoalModalEditComponent,
        GoalModalDeleteComponent,
        SubmitBttnComponent,
        NotLoggedComponent,
        SavingsCardComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class GoalsComponent implements OnInit {
  formData = {
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    startDate: '',
    endDate: ''
  }
  isModalEditOpen = signal<boolean>(false)
  isModalDeleteOpen = signal<boolean>(false)
  selectedSaving: Saving | null = null
  private readonly formSubmit
  private readonly title
  private readonly authCache
  isLogged: boolean
  readonly store = inject(SavingsStore)
  readonly alertService = inject(AlertService)
  savings = this.store.savings

  constructor() {
    this.formSubmit = inject(FormSubmitService)
    this.title = inject(Title)
    this.authCache = inject(AuthCacheService)
    this.isLogged = this.authCache.isAuthenticated()
  }

  ngOnInit(): void {
    this.title.setTitle('Savings | Money Minder')
  }

  onNewSavingSubmit() {
    this.formSubmit.savingSubmit(this.formData).subscribe({
      next: () => {
        this.alertService.showSuccess({ feature: 'saving', action: 'create' })
        this.store.addSaving({
          id: Math.floor(Math.random() * 1000000),
          name: this.formData.name,
          target_amount: this.formData.targetAmount,
          current_amount: this.formData.currentAmount,
          end_date: this.formData.endDate
        })
        this.formData = {
          name: '',
          targetAmount: 0,
          currentAmount: 0,
          startDate: '',
          endDate: ''
        }
      },
      error: () => {
        this.alertService.showError({ feature: 'saving', action: 'create' })
      }
    })
  }

  openEditModal(saving: Saving) {
    this.isModalEditOpen.set(true)
    this.selectedSaving = saving
  }

  closeEditModal() {
    this.isModalEditOpen.set(false)
    this.selectedSaving = null
  }

  openDeleteModal(saving: Saving) {
    this.isModalDeleteOpen.set(true)
    this.selectedSaving = saving
  }

  closeDeleteModal() {
    this.isModalDeleteOpen.set(false)
    this.selectedSaving = null
  }

  editSaving(saving: EditSaving) {
    this.formSubmit.editSaving(saving).subscribe({
      next: () => {
        this.closeEditModal()
        this.alertService.showInfo({ feature: 'saving', action: 'update' })
        this.store.editSaving({
          id: saving.id,
          name: saving.newSavingName,
          target_amount: saving.newTarget,
          current_amount: saving.newCurrentAmount,
          end_date: saving.newEndDate
        })
      },
      error: () => {
        this.alertService.showError({ feature: 'saving', action: 'update' })
      }
    })
  }

  deleteSaving(id: number) {
    this.formSubmit.deleteSaving(id).subscribe({
      next: () => {
        this.closeDeleteModal()
        this.store.removeSaving(id)
        this.alertService.showInfo({ feature: 'saving', action: 'delete' })
      },
      error: () => {
        this.alertService.showError({ feature: 'saving', action: 'delete' })
      }
    })
  }
}

import { CurrencyPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  type OnInit,
  inject,
  signal
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'

import {
  AlertMessageComponent,
  NotLoggedComponent,
  SubmitBttnComponent
} from '@app/core'
import type { EditSaving, Saving } from '@app/models'
import {
  AuthCacheService,
  FormSubmitService
} from '@app/services'
import { timer } from 'rxjs'
import { GoalModalDeleteComponent } from './goal-modal-delete'
import { GoalModalEditComponent } from './goal-modal-edit'
import { SavingsStore } from '@app/store'

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  standalone: true,
  imports: [
    AlertMessageComponent,
    FormsModule,
    GoalModalEditComponent,
    GoalModalDeleteComponent,
    SubmitBttnComponent,
    NotLoggedComponent,
    CurrencyPipe
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
  amSuccess = signal<boolean>(false)
  amWarning = signal<boolean>(false)
  private readonly formSubmit
  private readonly cdr
  private readonly title
  private readonly authCache
  isLogged: boolean
  readonly store = inject(SavingsStore)
  savings = this.store.savings

  constructor() {
    this.formSubmit = inject(FormSubmitService)
    this.cdr = inject(ChangeDetectorRef)
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
        this.amSuccess.set(true)
        this.store.addSaving({
          id: Math.floor(Math.random() * 1000000),
          name: this.formData.name,
          target_amount: this.formData.targetAmount,
          current_amount: this.formData.currentAmount,
          end_date: this.formData.endDate
        })
        this.cdr.detectChanges()
        timer(3500).subscribe(() => {
          this.amSuccess.set(false)
          this.cdr.detectChanges()
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
        this.amWarning.set(true)
        console.log('Error submitting new saving')
        this.cdr.detectChanges()
        timer(3500).subscribe(() => {
          this.amWarning.set(false)
          this.cdr.detectChanges()
        })
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
        this.store.editSaving({
          id: saving.id,
          name: saving.newSavingName,
          target_amount: saving.newTarget,
          current_amount: saving.newCurrentAmount,
          end_date: saving.newEndDate
        })
        this.cdr.detectChanges()
      },
      error: () => {
        console.log('Error editing saving')
      }
    })
  }

  deleteSaving(id: number) {
    this.formSubmit.deleteSaving(id).subscribe({
      next: () => {
        this.closeDeleteModal()
        this.store.removeSaving(id)
        this.cdr.detectChanges()
      },
      error: () => {
        console.log('Error deleting saving')
      }
    })
  }

  calculateProgress(saving: Saving): number {
    const progress = Math.round(
      (saving.current_amount / saving.target_amount) * 100
    )
    return progress > 100 ? 100 : progress
  }
}

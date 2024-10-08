import { AsyncPipe, CurrencyPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  type OnInit,
  inject
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
  ApiCallsService,
  AuthCacheService,
  FormSubmitService
} from '@app/services'
import { timer } from 'rxjs'
import { GoalModalDeleteComponent } from './goal-modal-delete'
import { GoalModalEditComponent } from './goal-modal-edit'

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  standalone: true,
  imports: [
    AlertMessageComponent,
    FormsModule,
    AsyncPipe,
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
  isModalEditOpen = false
  isModalDeleteOpen = false
  selectedSaving: Saving | null = null
  amSuccess = false
  amWarning = false
  private readonly apiCalls
  private readonly formSubmit
  private readonly cdr
  private readonly title
  private readonly authCache
  isLogged: boolean
  savings$

  constructor() {
    this.apiCalls = inject(ApiCallsService)
    this.formSubmit = inject(FormSubmitService)
    this.cdr = inject(ChangeDetectorRef)
    this.title = inject(Title)
    this.authCache = inject(AuthCacheService)
    this.isLogged = this.authCache.isAuthenticated()
    this.savings$ = this.apiCalls.getSavings()
  }

  ngOnInit(): void {
    this.title.setTitle('Savings | Money Minder')
  }

  onNewSavingSubmit() {
    this.formSubmit.savingSubmit(this.formData).subscribe({
      next: () => {
        this.amSuccess = true
        this.savings$ = this.apiCalls.getSavings()
        this.cdr.detectChanges()
        timer(3500).subscribe(() => {
          this.amSuccess = false
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
        this.amWarning = true
        console.log('Error submitting new saving')
        this.cdr.detectChanges()
        timer(3500).subscribe(() => {
          this.amWarning = false
          this.cdr.detectChanges()
        })
      }
    })
  }

  openEditModal(saving: Saving) {
    this.isModalEditOpen = true
    this.selectedSaving = saving
  }

  closeEditModal() {
    this.isModalEditOpen = false
    this.selectedSaving = null
  }

  openDeleteModal(saving: Saving) {
    this.isModalDeleteOpen = true
    this.selectedSaving = saving
  }

  closeDeleteModal() {
    this.isModalDeleteOpen = false
    this.selectedSaving = null
  }

  editSaving(saving: EditSaving) {
    this.formSubmit.editSaving(saving).subscribe({
      next: () => {
        this.closeEditModal()
        this.savings$ = this.apiCalls.getSavings()
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
        this.savings$ = this.apiCalls.getSavings()
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

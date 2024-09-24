import { NgOptimizedImage, AsyncPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { AuthCacheService } from '../../../services'
import { RecentTransactionsComponent } from './recent-transactions'
import { CashFlowComponent } from './cash-flow'
import { MainCategoriesComponent } from './main-categories'
import { GoalComponent } from './goals'
import { RemindersComponent } from './reminders'
import { QuoteComponent } from './quote'
import { FinancialSummaryComponent } from './financial-summary'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [
    NgOptimizedImage,
    AsyncPipe,
    RecentTransactionsComponent,
    CashFlowComponent,
    FinancialSummaryComponent,
    MainCategoriesComponent,
    GoalComponent,
    RemindersComponent,
    QuoteComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DashboardComponent implements OnInit {
  private readonly authCache
  private readonly titleService
  user
  isAuth

  constructor () {
    this.authCache = inject(AuthCacheService)
    this.titleService = inject(Title)

    this.user = this.authCache.getUser()
    this.isAuth = this.authCache.isAuthenticated()
  }

  ngOnInit () {
    this.titleService.setTitle('Dashboard | Money Minder')
  }
}

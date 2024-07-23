import { NgOptimizedImage, AsyncPipe } from '@angular/common'
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core'
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
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  private readonly authCache = inject(AuthCacheService)

  user = this.authCache.getUser()
  private readonly titleService = inject(Title)

  ngOnInit() {
    this.titleService.setTitle('Dashboard | Money Minder')
  }
}

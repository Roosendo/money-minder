import { Component, type OnInit, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { AuthCacheService } from "../../../services";
import { CashFlowComponent } from "./cash-flow";
import { FinancialSummaryComponent } from "./financial-summary";
import { GoalComponent } from "./goals";
import { MainCategoriesComponent } from "./main-categories";
import { QuoteComponent } from "./quote";
import { RecentTransactionsComponent } from "./recent-transactions";
import { RemindersComponent } from "./reminders";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  imports: [
    RecentTransactionsComponent,
    CashFlowComponent,
    FinancialSummaryComponent,
    MainCategoriesComponent,
    GoalComponent,
    RemindersComponent,
    QuoteComponent,
  ],
})
export default class DashboardComponent implements OnInit {
  private readonly authCache;
  private readonly titleService;
  isAuth;

  constructor() {
    this.authCache = inject(AuthCacheService);
    this.titleService = inject(Title);

    this.isAuth = this.authCache.isLoggedIn;
  }

  ngOnInit() {
    this.titleService.setTitle("Dashboard | Money Minder");
  }
}

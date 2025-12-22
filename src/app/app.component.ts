import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NavbarComponent } from './navbar/navbar.component';
import { ExpenseTabComponent } from './expense-tab/expense-tab.component';
import { IncomeTabComponent } from './income-tab/income-tab.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionService } from './transaction.service';
import { SummaryCardsComponent } from './summary-cards/summary-cards.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatTabsModule,
    NavbarComponent,
    ExpenseTabComponent,
    IncomeTabComponent,
    TransactionListComponent,
    SummaryCardsComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  service = inject(TransactionService);
  allTransactions  = this.service.transactionsReadonly;
}
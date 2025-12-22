import { Component, inject } from '@angular/core';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { SummaryCardsComponent } from '../summary-cards/summary-cards.component';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-expense-tab',
  standalone: true,
  imports: [TransactionFormComponent, TransactionListComponent, SummaryCardsComponent],
  template: `
    <app-summary-cards></app-summary-cards>
    <app-transaction-form type="expense"></app-transaction-form>
    <app-transaction-list [transactions]="service.getExpenses()"></app-transaction-list>
  `
})
export class ExpenseTabComponent {
  service = inject(TransactionService);
}
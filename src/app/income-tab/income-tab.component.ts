import { Component, inject } from '@angular/core';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { SummaryCardsComponent } from '../summary-cards/summary-cards.component';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-income-tab',
  standalone: true,
  imports: [TransactionFormComponent, TransactionListComponent, SummaryCardsComponent],
  template: `
    <app-summary-cards></app-summary-cards>
    <app-transaction-form type="income"></app-transaction-form>
    <app-transaction-list [transactions]="service.getIncomes()"></app-transaction-list>
  `
})
export class IncomeTabComponent {
  service = inject(TransactionService);
}
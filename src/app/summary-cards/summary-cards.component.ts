import { Component, inject } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [
    MatCardModule,
    CurrencyPipe,
    NgClass
  ],
  template: `
    <div class="summary-grid">
      <mat-card class="income-card">
        <mat-card-title>Total Income</mat-card-title>
        <mat-card-content class="big-number positive">
          {{ totalIncome() | currency:'INR' }}
        </mat-card-content>
      </mat-card>

      <mat-card class="expense-card">
        <mat-card-title>Total Expenses</mat-card-title>
        <mat-card-content class="big-number negative">
          {{ totalExpense() | currency:'INR' }}
        </mat-card-content>
      </mat-card>

      <mat-card class="balance-card">
        <mat-card-title>Current Balance</mat-card-title>
        <mat-card-content class="big-number" [ngClass]="{ negative: balance() < 0 }">
          {{ balance() | currency:'INR' }}
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }
    mat-card { text-align: center; padding: 16px; }
    .big-number { font-size: 2rem; font-weight: 700; margin-top: 8px; }
    .positive { color: #4caf50; }
    .negative { color: #f44336; }
    .income-card { border-top: 6px solid #4caf50; }
    .expense-card { border-top: 6px solid #f44336; }
    .balance-card { border-top: 6px solid #3f51b5; }
  `]
})
export class SummaryCardsComponent {
  service = inject(TransactionService);
  totalIncome = () => this.service.getTotalIncome();
  totalExpense = () => this.service.getTotalExpense();
  balance = () => this.service.getBalance();
}
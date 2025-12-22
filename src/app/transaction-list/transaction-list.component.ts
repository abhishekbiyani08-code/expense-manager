import { Component, Input, inject } from '@angular/core';
import { Transaction } from '../transaction.model';
import { DatePipe, CurrencyPipe, NgClass, NgIf, NgFor } from '@angular/common';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgClass,
    NgIf,
    NgFor
  ],
  template: `
    <div class="list">
      <div *ngFor="let t of transactions" class="transaction-card fade-in" [ngClass]="t.type">
        <div class="card-body">
          <div class="left">
            <div class="title">{{ t.description }}</div>
            <div class="subtitle">{{ t.date | date:'mediumDate' }}</div>
          </div>
          <div class="right">
            <div class="amount" [ngClass]="{'income-amt': t.type==='income','expense-amt': t.type==='expense'}">
              {{ t.type === 'income' ? '+' : '-' }}{{ t.amount | currency:'INR' }}
            </div>
          </div>
        </div>

        <button class="delete-btn" (click)="delete(t.id)" aria-label="Delete transaction">
          Delete
        </button>
      </div>

      <div *ngIf="transactions.length === 0" class="empty">
        No transactions yet. Add one above!
      </div>
    </div>
  `,
  styles: [`
    .list { margin-top: 16px; display: grid; gap: 12px; }
    .transaction-card {
      position: relative;
      display: block;
      border-radius: 12px;
      background: linear-gradient(180deg, #ffffff, #fbfbfd);
      box-shadow: 0 6px 18px rgba(15,23,42,0.06);
      overflow: hidden;
      transition: transform .12s ease, box-shadow .12s ease;
      border-left: 6px solid transparent;
    }
    .transaction-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(15,23,42,0.08); }

    .transaction-card.income { border-left-color: #34c759; }
    .transaction-card.expense { border-left-color: #ff4d4f; }

    .card-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 110px 14px 16px;
    }
    .left { display:flex; flex-direction:column; gap:4px; }
    .title { font-weight: 600; color: #0f1724; font-size: 1rem; }
    .subtitle { font-size: 0.85rem; color: #6b7280; }

    .right { display:flex; align-items:center; justify-content:flex-end; min-width:120px; }

    .amount { font-weight: 700; font-size: 1.1rem; color: #0f1724; text-align: right; }
    .income-amt { color: #07804a; }
    .expense-amt { color: #b91c1c; }

    .delete-btn {
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      min-width: 68px;
      height: 36px;
      padding: 6px 12px;
      border: none;
      border-radius: 10px;
      background: rgba(244,67,54,0.06);
      color: #b91c1c;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background .12s ease, transform .08s ease;
      margin-left: 0;
      z-index: 10;
    }
    .delete-btn:hover { background: rgba(244,67,54,0.12); }
    .delete-btn:active { transform: translateY(-50%); }

    .empty { text-align: center; color: #6b7280; padding: 40px; font-style: italic; }
    .fade-in { animation: fadeIn .18s ease both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
  `]
})
export class TransactionListComponent {
  @Input({ required: true }) transactions!: Transaction[];

  private service = inject(TransactionService);

  delete(id: number) {
    if (confirm('Delete this transaction?')) {
      this.service.deleteTransaction(id);
    }
  }
}
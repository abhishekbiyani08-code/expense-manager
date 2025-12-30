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

          <div class="center">
            <div class="amount" [ngClass]="{'income-amt': t.type==='income','expense-amt': t.type==='expense'}" title="{{ t.amount | currency:'INR' }}">
              {{ t.type === 'income' ? '+' : '-' }}{{ t.amount | currency:'INR' }}
            </div>
          </div>

          <div class="actions">
            <button class="update-btn" (click)="update(t.id)" aria-label="Update transaction">
              Update
            </button>

            <button class="delete-btn" (click)="delete(t.id)" aria-label="Delete transaction">
              Delete
            </button>
          </div>
        </div>
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
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
      overflow: hidden;
      transition: transform .12s ease, box-shadow .12s ease;
      border-left: 6px solid transparent;
    }

    .transaction-card.income { border-left-color: #34c759; }
    .transaction-card.expense { border-left-color: #ff4d4f; }

    .card-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px;
    }

    .left { display:flex; flex-direction:column; gap:4px; flex: 1 1 auto; min-width: 0; }
    .title { font-weight: 600; color: #0f1724; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .subtitle { font-size: 0.85rem; color: #6b7280; }

    .center { flex: 0 0 auto; display:flex; align-items:center; justify-content:flex-end; min-width: 0; margin-left: 12px; }
    .amount {
      font-weight: 700;
      font-size: 1.05rem;
      color: #0f1724;
      text-align: right;
      max-width: 140px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .income-amt { color: #07804a; }
    .expense-amt { color: #b91c1c; }

    .actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: 0 0 auto;
      margin-left: 12px;
    }

    .delete-btn, .update-btn {
      min-width: 68px;
      height: 36px;
      padding: 6px 12px;
      border: none;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background .12s ease, transform .08s ease;
    }

    .delete-btn {
      background: rgba(244, 67, 54, 0.2);
      color: #b91c1c;
    }
    .delete-btn:hover { background: rgba(244, 67, 54, 0.7); color: #fff; }

    .update-btn {
      background: rgba(33, 150, 243, 0.2);
      color: #1976d2;
      min-width: 80px;
    }
    .update-btn:hover { background: rgba(33, 150, 243, 0.7); color: #fff; }

    .empty { text-align: center; color: #6b7280; padding: 40px; font-style: italic; }
    .fade-in { animation: fadeIn .5s ease both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }

    @media (max-width: 600px) {
      .card-body {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding: 12px;
      }
      .left { min-width: 0; }
      .center { justify-content: flex-start; }
      .amount { max-width: 100%; white-space: normal; overflow: visible; text-overflow: unset; }
      .actions { justify-content: flex-end; width: 100%; }
      .update-btn, .delete-btn { min-width: 96px; flex: 0 0 auto; }
    }
  `]
})
export class TransactionListComponent {
  @Input({ required: true }) transactions!: Transaction[];

  private service = inject(TransactionService);

  delete(id: number) {
    if (confirm('Delete this transaction?'))
    {
      this.service.deleteTransaction(id);
    }
  }

  update(id: number) {
    const t = this.service.getTransactionById(id);
    if (!t)
    {
      alert('Transaction not found.');
      return;
    }

    const newDescription = prompt('Update description:', t.description);
    if (newDescription === null)
      return;

    const newAmountStr = prompt('Update amount:', t.amount.toString());
    if (newAmountStr === null)
      return;
    const newAmount = parseFloat(newAmountStr);
    if (isNaN(newAmount) || newAmount <= 0)
    {
      alert('Invalid amount entered.');
      return;
    }

    const existingDateIso = (t.date instanceof Date ? t.date : new Date(t.date)).toISOString().slice(0, 10);
    const newDateStr = prompt('Update date (YYYY-MM-DD):', existingDateIso);
    if (newDateStr === null)
      return;
    const newDate = new Date(newDateStr);
    if (isNaN(newDate.getTime()))
    {
      alert('Invalid date entered.');
      return;
    }

    this.service.updateTransaction(id, {
      description: newDescription,
      amount: newAmount,
      date: newDate
    });
  }
}
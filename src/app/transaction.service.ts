import { Injectable, signal, effect, inject, isDevMode } from '@angular/core';
import { Transaction } from './transaction.model';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions = signal<Transaction[]>([]);
  transactionsReadonly = this.transactions.asReadonly();

  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    if (this.isBrowser)
    {
      const saved = localStorage.getItem('expenseManagerTransactions');
      if (saved)
      {
        try
        {
          const parsed = JSON.parse(saved);
          this.transactions.set(
            parsed.map((t: any) => ({ ...t, date: new Date(t.date) }))
          );
        }
        catch (e)
        {
          if (isDevMode())
          {
            console.warn('Failed to parse saved transactions', e);
          }
        }
      }
      else
      {
        this.transactions.set([]);
      }

      effect(() => {
        localStorage.setItem(
          'expenseManagerTransactions',
          JSON.stringify(this.transactions())
        );
      });
    }
  }

  addTransaction(transaction: Transaction) {
    this.transactions.update(list => [transaction, ...list]);
  }

  deleteTransaction(id: number) {
    this.transactions.update(list => list.filter(t => t.id !== id));
  }

  updateTransaction(idOrTransaction: number | Transaction, updated?: Partial<Transaction>) {
    let id: number;
    let upd: Partial<Transaction>;

    if (typeof idOrTransaction === 'number')
    {
      id = idOrTransaction;
      upd = updated ?? {};
    }
    else
    {
      id = idOrTransaction.id;
      upd = updated ?? {
        description: idOrTransaction.description,
        amount: idOrTransaction.amount,
        date: idOrTransaction.date,
        type: idOrTransaction.type
      };
    }

    this.transactions.update(list =>
      list.map(t => t.id === id ? { ...t, ...upd } : t)
    );
  }

  getTransactionById(id: number) {
    return this.transactionsReadonly().find(t => t.id === id);
  }

  getBalance() {
    return this.transactionsReadonly().reduce(
      (sum, t) => (t.type === 'income' ? sum + t.amount : sum - t.amount),
      0
    );
  }

  getTotalIncome() {
    return this.transactionsReadonly()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpense() {
    return this.transactionsReadonly()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getExpenses() {
    return this.transactionsReadonly().filter(t => t.type === 'expense');
  }

  getIncomes() {
    return this.transactionsReadonly().filter(t => t.type === 'income');
  }

  getAllTransactions() {
    return this.transactionsReadonly();
  }
}
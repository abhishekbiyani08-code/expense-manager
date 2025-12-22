import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid-form" novalidate>
        <div class="form-field">
          <label for="description">Description</label>
          <input id="description" class="form-input" type="text" formControlName="description" placeholder="e.g., Grocery, Salary">
          <div class="error" *ngIf="form.controls.description.touched && form.controls.description.invalid">Required</div>
        </div>

        <div class="form-field">
          <label for="amount">Amount</label>
          <input id="amount" class="form-input" type="number" formControlName="amount" min="0.01" step="0.01" placeholder="0.00">
          <div class="error" *ngIf="form.controls.amount.touched && form.controls.amount.invalid">Enter a valid amount</div>
        </div>

        <div class="form-field">
          <label for="date">Date</label>
          <input id="date" class="form-input date-input" type="date" formControlName="date">
          <div class="error" *ngIf="form.controls.date.touched && form.controls.date.invalid">Required</div>
        </div>

        <div class="form-actions">
          <button type="submit" class="modern-btn" [class.income]="type === 'income'" [class.expense]="type === 'expense'" [disabled]="form.invalid">
            Add {{ type === 'income' ? 'Income' : 'Expense' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container { padding: 24px 0; }
    .grid-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      align-items: end;
    }

    .form-field { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 0.9rem; color: #444; }

    .form-input {
      appearance: none;
      -webkit-appearance: none;
      padding: 10px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fff;
      color: #111;
      font-size: 1rem;
      outline: none;
      transition: box-shadow .12s ease, border-color .12s ease;
      box-shadow: 0 1px 2px rgba(16,24,40,0.03);
    }
    .form-input:focus { border-color: #8ab4ff; box-shadow: 0 4px 12px rgba(34,139,230,0.12); }

    /* Date specific tweaks to avoid transparent appearance */
    .date-input::-webkit-calendar-picker-indicator { filter: invert(0.15) sepia(0.02); }
    .date-input { background: #fff; }

    .error { color: #d32f2f; font-size: 0.8rem; margin-top: 4px; }

    .form-actions { display: flex; align-items: center; }

    .modern-btn {
      padding: 10px 18px;
      border: none;
      border-radius: 999px;
      color: #fff;
      cursor: pointer;
      font-weight: 600;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
      transition: transform .08s ease, box-shadow .12s ease, opacity .12s ease;
      opacity: 1;
    }
    .modern-btn:active { transform: translateY(1px); }
    .modern-btn[disabled] { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

    .modern-btn.income { background: linear-gradient(90deg,#28c76f,#20a464); }
    .modern-btn.expense { background: linear-gradient(90deg,#ff6b6b,#ff3b3b); }
  `]
})
export class TransactionFormComponent {
  @Input({ required: true }) type!: 'expense' | 'income';

  private fb = inject(FormBuilder);
  private service = inject(TransactionService);

  form = this.fb.group({
    description: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().substring(0,10), Validators.required]
  });

  onSubmit() {
    if (this.form.valid) {
      const values = this.form.value;
      const transaction: Transaction = {
        id: Date.now(),
        description: values.description!,
        amount: values.amount!,
        // date input returns YYYY-MM-DD string; convert to Date
        date: new Date(values.date!),
        type: this.type
      };
      this.service.addTransaction(transaction);
      this.form.patchValue({ description: '', amount: null, date: new Date().toISOString().substring(0,10) });
    }
  }
}
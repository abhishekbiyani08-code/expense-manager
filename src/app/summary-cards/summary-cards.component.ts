import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChangeDetectorRef } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
          {{ animIncome | currency:'INR' }}
        </mat-card-content>
      </mat-card>

      <mat-card class="expense-card">
        <mat-card-title>Total Expenses</mat-card-title>
        <mat-card-content class="big-number negative">
          {{ animExpense | currency:'INR' }}
        </mat-card-content>
      </mat-card>

      <mat-card class="balance-card">
        <mat-card-title>Current Balance</mat-card-title>
        <mat-card-content class="big-number" [ngClass]="{ negative: animBalance < 0 }">
          {{ animBalance | currency:'INR' }}
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
export class SummaryCardsComponent implements OnInit, OnDestroy {
  service = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  animIncome = 0;
  animExpense = 0;
  animBalance = 0;

  private rafId: number | null = null;
  private animationDuration = 900;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId))
    {
      this.startAnimation();
    }
  }

  ngOnDestroy(): void {
    if (this.rafId != null)
      cancelAnimationFrame(this.rafId);
  }

  totalIncome = () => this.service.getTotalIncome();
  totalExpense = () => this.service.getTotalExpense();
  balance = () => this.service.getBalance();

  private startAnimation() {
    if (this.rafId != null)
      cancelAnimationFrame(this.rafId);

    const startTimeRef = { start: 0 };
    const fromIncome = 0;
    const fromExpense = 0;
    const fromBalance = 0;
    const toIncome = this.totalIncome();
    const toExpense = this.totalExpense();
    const toBalance = this.balance();
    const duration = this.animationDuration;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTimeRef.start)
        startTimeRef.start = timestamp;
      const elapsed = timestamp - startTimeRef.start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);

      this.animIncome = Math.round((fromIncome + (toIncome - fromIncome) * eased) * 100) / 100;
      this.animExpense = Math.round((fromExpense + (toExpense - fromExpense) * eased) * 100) / 100;
      this.animBalance = Math.round((fromBalance + (toBalance - fromBalance) * eased) * 100) / 100;

      this.cdr.detectChanges();

      if (t < 1)
      {
        this.rafId = requestAnimationFrame(step);
      }
      else
      {
        this.rafId = null;
      }
    };

    this.rafId = requestAnimationFrame(step);
  }
}
import { Component, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, NgClass } from '@angular/common';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    NgClass
  ],
  template: `
    <mat-toolbar color="primary" style="background-color: #dfdfdfff;">
      <span class="title">Expense Manager by <span style="font-weight: bolder; color: #6000a0ff; ">Abhishek Biyani</span></span>
      <span class="spacer"></span>

      <span class="balance" [ngClass]="{ negative: balance() < 0 , positive: balance() >= 0 }">
        Balance: <span style="color: #6000a0ff">{{ balance() | currency:'INR' }}</span>
      </span>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .title { font-weight: 500; margin-left: 30px; }
    .balance { font-size: 1.2rem; font-weight: 600; margin-left: 16px; }
    .negative { color: #ff4444; }
    .positive { color: #00C851; }
  `]
})
export class NavbarComponent {
  private service = inject(TransactionService);

  balance = computed(() => this.service.getBalance());
}
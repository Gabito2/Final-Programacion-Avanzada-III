import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBadge, IonLabel, IonList, IonItem, IonButtons, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ExpenseService } from '../services/expense-service';
import { Router } from '@angular/router';
import { Expense } from '../model/expense';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonBadge, IonLabel, IonList, IonItem, NgFor, NgIf],
})
export class Tab1Page {
  private service = inject(ExpenseService);
  private router = inject(Router);

  expenses: Expense[] = [];

  ionViewWillEnter() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.service.getAllExpenses().subscribe({
      next: (data) => {
        this.expenses = data.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
      },
      error: (e) => alert(e.message)
    });
  }

  getColor(cat: Expense['categoria']) {
    return {
      comida: 'danger',
      transporte: 'warning',
      salud: 'success',
      ocio: 'primary'
    }[cat];
  }

}

import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonBadge,
  IonModal, IonButton, IonInput, IonSelect,
  IonSelectOption, IonCheckbox, AlertController
} from '@ionic/angular/standalone';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense-service';
import { Expense } from '../model/expense';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonBadge, IonButton, IonInput, IonSelect,
    IonSelectOption, IonCheckbox,
    ReactiveFormsModule, NgFor, NgIf,
    IonModal
  ]
})
export class Tab3Page {

  private service = inject(ExpenseService);
  private fb = inject(NonNullableFormBuilder);
  private alertCtrl = inject(AlertController);

  expenses: Expense[] = [];
  selectedExpense: Expense | null = null;
  isModalOpen = false;

  form = this.fb.group({
    concepto: ['', Validators.required],
    categoria: ['comida' as Expense['categoria'], Validators.required],
    monto: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    pagado: false
  });

  ionViewWillEnter() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.service.getAllExpenses().subscribe(data => {
      this.expenses = data.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
    });
  }

  openEdit(expense: Expense) {
    this.selectedExpense = expense;
    this.form.patchValue(expense);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedExpense = null;
  }

  save() {
    if (this.form.invalid || !this.selectedExpense) return;

    const payload: Expense = {
      ...this.selectedExpense,
      ...this.form.getRawValue()
    };

    this.service.update(payload.id, payload).subscribe(() => {
      this.closeModal();
      this.loadExpenses();
    });
  }

  async delete() {
    if (!this.selectedExpense) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar gasto',
      message: '¿Desea eliminar este gasto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.service.delete(this.selectedExpense!.id).subscribe(() => {
              this.closeModal();
              this.loadExpenses();
            });
          }
        }
      ]
    });

    await alert.present();
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

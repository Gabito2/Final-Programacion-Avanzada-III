import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, AlertController, IonButton, IonItem, IonLabel, IonInput, IonCheckbox, IonSelectOption, IonSelect, IonList, IonBackButton, IonButtons, IonBadge } from '@ionic/angular/standalone';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from '../model/expense';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput, IonCheckbox, IonSelectOption, IonSelect, IonList, ReactiveFormsModule, IonBadge, NgFor, NgIf],
})
export class Tab3Page {
  private fb = inject(NonNullableFormBuilder);
  private service = inject(ExpenseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  selectedExpense: Expense | null = null;
  expenses: Expense[] = [];

  id!: number;

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

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getById(String(this.id)).subscribe(expense => {
      this.form.patchValue(expense);
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const payload: Expense = {
      id: String(this.id),
      ...raw
    };

    this.service.update(String(this.id), payload).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar gasto',
      message: '¿Seguro que desea eliminar este gasto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.service.delete(String(this.id)).subscribe(() => {
              this.router.navigateByUrl('/');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  selectExpense(expense: Expense) {
    this.selectedExpense = expense;
    this.form.patchValue(expense);
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

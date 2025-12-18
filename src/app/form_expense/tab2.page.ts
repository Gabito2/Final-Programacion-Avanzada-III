import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel,
  IonInput, IonButton, IonSelect, IonSelectOption, IonCheckbox
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

import { Expense } from '../model/expense';
import { ExpenseService } from '../services/expense-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-expense-form',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule, NgIf,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonList, IonItem, IonLabel,
    IonInput, IonButton, IonSelect, IonSelectOption, IonCheckbox
  ]
})
export class ExpenseFormPage {

  private fb = inject(NonNullableFormBuilder);
  private service = inject(ExpenseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: number | null = null;

  expenseForm = this.fb.group({
    concepto: ['', Validators.required],
    categoria: ['comida' as Expense['categoria'], Validators.required],
    monto: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    pagado: false
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id && id !== 'new') {
          this.id = Number(id);
          return this.service.getById(id);
        }
        this.id = null;
        return of(null);
      })
    ).subscribe(expense => {
      if (expense) {
        this.expenseForm.patchValue(expense);
      }
    });
  }

  save() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const raw = this.expenseForm.getRawValue();

    const payload: Expense = {
      id: this.id ? String(this.id) : '0',
      concepto: raw.concepto,
      categoria: raw.categoria,
      monto: raw.monto,
      fecha: raw.fecha,
      pagado: raw.pagado
    };

    const obs = this.id == null
      ? this.service.create(payload)
      : this.service.update(String(this.id), payload);

    obs.subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => alert(e.message)
    });
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}

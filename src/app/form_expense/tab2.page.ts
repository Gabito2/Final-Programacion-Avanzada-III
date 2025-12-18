import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense-service';
import { Router } from '@angular/router';
import { Expense } from '../model/expense';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
export class Tab2Page {

  private Expense_Service = inject(ExpenseService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    id: [""],
    concepto: ['', Validators.required],
    categoria: ['comida', Validators.required],
    monto: [null, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    pagado: [false]
  });

  ngOnInit() { }

  guardar() {
    if (this.form.valid) {
      this.Expense_Service.create(this.form.value as Expense)
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
  }

}

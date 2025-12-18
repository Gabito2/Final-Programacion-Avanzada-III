import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Expense } from '../model/expense';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private api_url = 'http://localhost:3000/expenses';
  private http = inject(HttpClient);

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.api_url);
  }

  getById(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.api_url}/${id}`);
  }

  create(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.api_url, expense);
  }

  update(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.api_url}/${id}`, expense);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api_url}/${id}`);
  }
}


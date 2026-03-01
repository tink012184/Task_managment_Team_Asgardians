import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import type { Task } from './models/task';
export type { Task } from './models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly baseUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  updateTask(id: string, payload: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, payload);
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  searchTasks(q: string): Observable<Task[]> {
    const query = (q || '').trim();
    return this.http.get<Task[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }
}

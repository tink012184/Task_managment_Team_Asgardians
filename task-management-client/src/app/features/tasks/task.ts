import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: string; // "Pending" | "In Progress" | "Complete"
  priority: string; // "Low" | "Medium" | "High"
  dueDate?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly baseUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  // Existing create (keep if you already have it)
  createTask(task: Partial<Task>): Observable<any> {
    return this.http.post(this.baseUrl, task);
  }

  // ✅ Needed for UpdateTaskComponent (load)
  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // ✅ Needed for UpdateTaskComponent (save)
  updateTask(id: string, payload: Partial<Task>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  // Optional (if you have list/dashboard usage)
  getTasks(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Optional
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

 
  createTask(task: Partial<Task>): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  // ✅ Needed for UpdateTaskComponent (load)
  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ✅ Needed for UpdateTaskComponent (save)
  updateTask(id: string, payload: Partial<Task>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  searchTasks(q: string): Observable<Task[]> {
    const query = (q || '').trim();
    return this.http.get<Task[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }
}

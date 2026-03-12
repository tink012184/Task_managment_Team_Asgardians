import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './models/task';

export interface ApiMessage {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://task-managment-team-asgardians-server.onrender.com/api/tasks';


  constructor(private http: HttpClient) {}

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  updateTask(id: string, payload: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, payload);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  searchTasks(q: string): Observable<Task[]> {
    const query = (q || '').trim();
    return this.http.get<Task[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  deleteTask(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Task } from './models/task';

export interface ApiMessage {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.taskApiUrl;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getAllTasks(): Observable<Task[]> {
    return this.getTasks();
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task | ApiMessage> {
    return this.http.post<Task | ApiMessage>(this.apiUrl, task);
  }

  updateTask(id: string, payload: Partial<Task>): Observable<Task | ApiMessage> {
    return this.http.put<Task | ApiMessage>(`${this.apiUrl}/${id}`, payload);
  }

  deleteTask(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.apiUrl}/${id}`);
  }

  searchTasks(query: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?search=${encodeURIComponent(query)}`);
  }
}

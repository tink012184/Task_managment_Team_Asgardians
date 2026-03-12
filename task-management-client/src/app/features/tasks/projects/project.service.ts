import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { Project } from './projects.model';

export interface ApiMessage {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.projectApiUrl;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getAllProjects(): Observable<Project[]> {
    return this.getProjects();
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(project: Project): Observable<Project | ApiMessage> {
    return this.http.post<Project | ApiMessage>(this.apiUrl, project);
  }

  updateProject(id: string, payload: Partial<Project>): Observable<Project | ApiMessage> {
    return this.http.put<Project | ApiMessage>(`${this.apiUrl}/${id}`, payload);
  }

  deleteProject(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.apiUrl}/${id}`);
  }
}

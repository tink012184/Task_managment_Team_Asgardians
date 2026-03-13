import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from '../project.service';

type MessageType = 'success' | 'error' | '';

interface Project {
  _id?: string;
  name: string;
  description: string;
  startDate: string;
}

@Component({
  selector: 'app-project-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project-update.html',
  styleUrls: ['./project-update.css'],
})
export class ProjectUpdateComponent implements OnInit {
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  projects: Project[] = [];
  selectedProjectId = '';

  loadingProjects = false;
  loadingProject = false;
  submitting = false;
  projectLoaded = false;

  project: Project = {
    name: '',
    description: '',
    startDate: '',
  };

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }

  loadProjects(): void {
    this.loadingProjects = true;
    this.clearMessage();
    this.cdr.detectChanges();

    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.loadingProjects = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load projects:', err);
        this.message = 'Failed to load projects.';
        this.messageType = 'error';
        this.loadingProjects = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadProject(): void {
    this.clearMessage();
    this.projectLoaded = false;

    if (!this.selectedProjectId) {
      this.message = 'Please select a project.';
      this.messageType = 'error';
      this.cdr.detectChanges();
      return;
    }

    this.loadingProject = true;
    this.cdr.detectChanges();

    this.projectService.getProjectById(this.selectedProjectId).subscribe({
      next: (project: Project) => {
        this.project = {
          _id: project._id,
          name: project.name || '',
          description: project.description || '',
          startDate: project.startDate ? String(project.startDate).substring(0, 10) : '',
        };
        this.projectLoaded = true;
        this.loadingProject = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load project:', err);
        this.message = err?.error?.message || 'Failed to load project.';
        this.messageType = 'error';
        this.loadingProject = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateProject(): void {
    const id = this.selectedProjectId;

    if (!id) {
      this.message = 'Please select a project.';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.message = '';
    this.messageType = '';

    this.projectService.updateProject(id, this.project).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Project updated successfully.';
        this.messageType = 'success';
      },
      error: (err: any) => {
        this.loading = false;
        this.message = err?.error?.message || 'Failed to update project.';
        this.messageType = 'error';
      },
    });
  }

  returnToMain(): void {
    this.router.navigate(['/']);
  }
}

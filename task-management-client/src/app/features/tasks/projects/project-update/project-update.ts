import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../project.service';

type MessageType = 'success' | 'error' | '';

@Component({
  selector: 'app-project-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project-update.html',
  styleUrls: ['./project-update.css'],
})
export class ProjectUpdateComponent implements OnInit {
  projects: any[] = [];
  selectedProjectId = '';
  loading = false;
  projectLoaded = false;

  project: any = {
    name: '',
    description: '',
    startDate: '',
  };

  message = '';
  messageType: MessageType = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects: any[]) => {
        this.projects = projects;
      },
      error: () => {
        this.message = 'Failed to load projects.';
        this.messageType = 'error';
      },
    });
  }

  loadProject(): void {
    this.clearMessage();
    this.projectLoaded = false;

    if (!this.selectedProjectId) {
      this.message = 'Please select a project.';
      this.messageType = 'error';
      return;
    }

    this.projectService.getProjectById(this.selectedProjectId).subscribe({
      next: (project: any) => {
        this.project = {
          name: project.name || '',
          description: project.description || '',
          startDate: project.startDate ? project.startDate.substring(0, 10) : '',
        };
        this.projectLoaded = true;
      },
      error: (err) => {
        this.message = err?.error?.message || 'Failed to load project.';
        this.messageType = 'error';
      },
    });
  }

  updateProject(): void {
    this.clearMessage();

    if (!this.selectedProjectId) {
      this.message = 'Please select a project.';
      this.messageType = 'error';
      return;
    }

    this.projectService.updateProject(this.selectedProjectId, this.project).subscribe({
      next: () => {
        this.message = 'Project updated successfully.';
        this.messageType = 'success';
        this.loadProjects();
      },
      error: (err) => {
        this.message = err?.error?.message || 'Failed to update project.';
        this.messageType = 'error';
      },
    });
  }

  returnToMain(): void {
    this.router.navigate(['/']);
  }
}

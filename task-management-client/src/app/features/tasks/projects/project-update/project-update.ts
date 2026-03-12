import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../projects.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-update.html',
  styleUrls: ['./project-update.css'],
})
export class ProjectUpdateComponent {
  projectId = '';
  project: Project = {
    name: '',
    description: '',
    startDate: '',
  };

  projectLoaded = false;
  message = '';
  error = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) {}

  goHome() {
    this.router.navigateByUrl('/');
  }

  loadProject(): void {
    this.message = '';
    this.error = '';

    if (!this.projectId.trim()) {
      this.error = 'Project ID is required.';
      return;
    }

    this.projectService.getProjectById(this.projectId).subscribe({
      next: (data: any) => {
        console.log('Loaded project:', data);

        this.project = {
          name: data.name || '',
          description: data.description || '',
          startDate: data.startDate ? data.startDate.substring(0, 10) : '',
        };

        this.projectLoaded = true;
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Failed to load project.';
        this.projectLoaded = false;
      },
    });
  }

  updateProject(): void {
    this.message = '';
    this.error = '';

    const id = this.projectId.trim();
    if (!id) {
      this.error = 'Project ID is required.';
      return;
    }

    if (!this.project.name || !this.project.description || !this.project.startDate) {
      this.error = 'All fields are required.';
      return;
    }

    this.projectService.updateProject(id, this.project).subscribe({
      next: (project: any) => {
        this.project = {
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          _id: project._id,
        };

        this.projectLoaded = true;
        this.message = 'Project updated successfully.';
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to update project.';
      },
    });
  }
}

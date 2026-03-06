import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../projects.model';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent {
  project: Project = {
    name: '',
    description: '',
    startDate: '',
  };

  message = '';
  error = '';

  constructor(private projectService: ProjectService) {}

  submitProject(): void {
    this.message = '';
    this.error = '';

    if (!this.project.name || !this.project.description || !this.project.startDate) {
      this.error = 'All fields are required.';
      return;
    }

    this.projectService.createProject(this.project).subscribe({
      next: () => {
        this.message = 'Project created successfully.';
        this.project = {
          name: '',
          description: '',
          startDate: '',
        };
      },
      error: () => {
        this.error = 'Failed to create project.';
      },
    });
  }
}

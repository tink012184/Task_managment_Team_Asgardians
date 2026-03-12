import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService, ApiMessage } from '../project.service';

@Component({
  selector: 'app-project-delete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-delete.html',
  styleUrls: ['./project-delete.css'],
})
export class ProjectDeleteComponent {
  projectId = '';
  message = '';

  constructor(private projectService: ProjectService) {}

  onDelete() {
    const id = this.projectId.trim();

    if (!id) {
      this.message = 'Project ID is required.';
      return;
    }

    this.projectService.deleteProject(id).subscribe({
      next: (response: ApiMessage) => {
        this.message = response?.message || 'Project deleted successfully.';
        this.projectId = '';
      },
      error: (err: HttpErrorResponse) => {
        this.message = err?.error?.message || 'Unable to delete project.';
      },
    });
  }
}

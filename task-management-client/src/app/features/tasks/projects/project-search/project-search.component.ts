import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProjectService } from '../project.service';
import { Project } from '../projects.model';

@Component({
  selector: 'app-project-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-search.component.html',
  styleUrls: ['./project-search.component.css'],
})
export class ProjectSearchComponent {
  query = '';
  errorMessage = '';
  message = '';
  results: Project[] = [];

  constructor(private projectService: ProjectService) {}

  search(): void {
    this.errorMessage = '';
    this.message = '';
    this.results = [];

    const term = (this.query || '').trim();

    if (!term) {
      this.message = 'No results.';
      return;
    }

    this.projectService.searchProjects(term).subscribe({
      next: (projects: Project[]) => {
        this.results = projects || [];

        if (this.results.length === 0) {
          this.message = 'No results.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to search projects.';
        this.message = 'Failed to search projects.';
        this.results = [];
      },
    });
  }
}

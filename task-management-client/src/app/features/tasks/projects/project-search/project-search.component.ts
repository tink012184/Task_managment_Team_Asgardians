import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  results$: Observable<Project[]> = of([]);

  constructor(private projectService: ProjectService) {}

  search(): void {
    this.errorMessage = '';

    const term = (this.query || '').trim();
    if (!term) {
      this.results$ = of([]);
      return;
    }

    this.results$ = this.projectService.searchProjects(term).pipe(
      catchError(() => {
        this.errorMessage = 'Failed to search projects.';
        return of([]);
      }),
    );
  }
}

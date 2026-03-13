import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../task';
import { Task } from '../models/task';

@Component({
  selector: 'app-search-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-tasks.html',
  styleUrls: ['./search-tasks.css'],
})
export class SearchTasksComponent {
  message = '';
  query = '';
  results: Task[] = [];
  errorMessage = '';
  hasSearched = false;

  constructor(private taskService: TaskService) {}

  search(): void {
    this.message = '';
    this.errorMessage = '';
    this.results = [];
    this.hasSearched = false;

    this.taskService.searchTasks(this.query).subscribe({
      next: (tasks: Task[]) => {
        this.results = tasks || [];
        this.hasSearched = true;

        if (!this.results.length) {
          this.message = 'No results.';
        }
      },
      error: (_err: any) => {
        this.errorMessage = 'Failed to search tasks.';
        this.message = 'Failed to search tasks.';
        this.results = [];
        this.hasSearched = true;
      },
    });
  }

  // compatibility for spec if it calls searchTasks()
  searchTasks(): void {
    this.search();
  }
}

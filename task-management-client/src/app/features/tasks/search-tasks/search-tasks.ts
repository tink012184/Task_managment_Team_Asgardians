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
  query = '';
  results: Task[] = [];
  errorMessage = '';
  hasSearched = false;

  constructor(private taskService: TaskService) {}

  search(): void {
    this.errorMessage = '';
    this.results = [];
    this.hasSearched = false;

    this.taskService.searchTasks(this.query).subscribe({
      next: (tasks: Task[]) => {
        this.results = tasks;
        this.hasSearched = true;
      },
      error: (_err: any) => {
        this.errorMessage = 'Failed to search tasks.';
        this.results = [];
        this.hasSearched = true;
      },
    });
  }
}

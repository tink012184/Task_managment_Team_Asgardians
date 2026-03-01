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

  constructor(private taskService: TaskService) {}

  search(): void {
    this.errorMessage = '';

    this.taskService.searchTasks(this.query).subscribe({
      next: (tasks: Task[]) => {
        setTimeout(() => {
          this.results = tasks;
        }, 0);
      },
      error: (_err: any) => {
        setTimeout(() => {
          this.errorMessage = 'Failed to search tasks.';
          this.results = [];
        }, 0);
      },
    });
  }
}

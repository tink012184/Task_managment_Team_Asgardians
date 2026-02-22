import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task';
import { Task } from '../models/task';

@Component({
  selector: 'app-read-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './read-task.html',
  styleUrls: ['./read-task.css'],
})
export class ReadTaskComponent {
  taskId = '';
  task: Task | null = null;
  message = '';

  constructor(private taskService: TaskService) {}

  onSearch() {
    const id = this.taskId.trim();

    if (!id) {
      this.task = null;
      this.message = 'Task ID is required.';
      return;
    }

    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.message = '';
      },
      error: (err) => {
        this.task = null;
        this.message = err?.error?.message || 'Unable to load task.';
      },
    });
  }
}

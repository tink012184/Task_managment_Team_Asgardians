import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-task.html',
  styleUrls: ['./delete-task.css'],
})
export class DeleteTaskComponent {
  taskId = '';
  message = '';

  constructor(private taskService: TaskService) {}

  onDelete() {
    const id = this.taskId.trim();

    if (!id) {
      this.message = 'Task ID is required.';
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: (response) => {
        this.message = response?.message || 'Task deleted successfully.';
        this.taskId = '';
      },
      error: (err) => {
        this.message = err?.error?.message || 'Unable to delete task.';
      },
    });
  }
}

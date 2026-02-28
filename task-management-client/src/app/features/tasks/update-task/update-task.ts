import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../task';

type MessageType = 'success' | 'error' | '';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './update-task.html',
  styleUrl: './update-task.css',
})
export class UpdateTaskComponent {
  taskId = '';
  loading = false;

  // Minimal task shape (match whatever your API returns)
  task: any = null;

  message = '';
  messageType: MessageType = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }

  loadTask(event?: Event): void {
    event?.preventDefault();
    this.clearMessage();

    const id = this.taskId.trim();
    if (!id) {
      this.messageType = 'error';
      this.message = 'Task ID is required.';
      return;
    }

    this.loading = true;

    this.taskService.getTaskById(id).subscribe({
      next: (res: any) => {
        // Your API might return { task: {...} } or the object directly
        this.task = res?.task ?? res;
        this.loading = false;

        if (!this.task) {
          this.messageType = 'error';
          this.message = 'Task not found.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageType = 'error';
        this.message = err?.error?.message || err?.message || 'Failed to load task.';
      },
    });
  }

  saveTask(event?: Event): void {
    event?.preventDefault();
    this.clearMessage();

    if (!this.taskId.trim()) {
      this.messageType = 'error';
      this.message = 'Task ID is required.';
      return;
    }

    if (!this.task?.title?.trim() || !this.task?.status || !this.task?.priority) {
      this.messageType = 'error';
      this.message = 'Title, Status, and Priority are required.';
      return;
    }

    const payload = {
      title: this.task.title,
      description: this.task.description ?? '',
      status: this.task.status,
      priority: this.task.priority,
      dueDate: this.task.dueDate ?? '',
      assignedTo: this.task.assignedTo ?? '',
    };

    this.loading = true;

    this.taskService.updateTask(this.taskId.trim(), payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.messageType = 'success';
        this.message = '✅ Task updated successfully!';

        // refresh local model from response if available
        const updated = res?.task ?? res;
        if (updated) this.task = updated;
      },
      error: (err) => {
        this.loading = false;
        this.messageType = 'error';
        this.message = err?.error?.message || err?.message || 'Failed to update task.';
      },
    });
  }

  returnToMain(): void {
    this.router.navigate(['/']);
  }
}

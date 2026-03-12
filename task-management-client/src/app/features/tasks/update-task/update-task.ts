import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../task';

type MessageType = 'success' | 'error' | '';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-task.html',
  styleUrls: ['./update-task.css'],
})
export class UpdateTaskComponent {
  taskId = '';
  loading = false;
  taskLoaded = false;

  task: any = null;

  message = '';
  error = '';
  messageType: MessageType = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}

  clearMessage(): void {
    this.message = '';
    this.error = '';
    this.messageType = '';
  }

  loadTask(): void {
    this.clearMessage();
    this.taskLoaded = false;

    const id = this.taskId.trim();

    if (!id) {
      this.error = 'Task ID is required.';
      this.messageType = 'error';
      return;
    }

    this.taskService.getTaskById(id).subscribe({
      next: (data: any) => {
        console.log('Loaded task:', data);

        this.task = {
          title: data.title || '',
          description: data.description || '',
          status: data.status || '',
          priority: data.priority || '',
          dueDate: data.dueDate ? data.dueDate.substring(0, 10) : '',
          assignedTo: data.assignedTo || '',
        };

        this.taskLoaded = true;
      },
      error: (err) => {
        console.error('Load task error:', err);
        this.error = err?.error?.message || 'Failed to load task.';
        this.messageType = 'error';
        this.taskLoaded = false;
      },
    });
  }

  updateTask(event?: Event): void {
    event?.preventDefault();
    this.clearMessage();

    if (!this.taskId.trim()) {
      this.error = 'Task ID is required.';
      this.messageType = 'error';
      return;
    }

    if (!this.task?.title?.trim() || !this.task?.status || !this.task?.priority) {
      this.error = 'Title, Status, and Priority are required.';
      this.messageType = 'error';
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
        this.message = 'Task updated successfully.';
        this.messageType = 'success';

        const updated = res?.task ?? res;
        if (updated) {
          this.task = {
            title: updated.title || '',
            description: updated.description || '',
            status: updated.status || '',
            priority: updated.priority || '',
            dueDate: updated.dueDate ? updated.dueDate.substring(0, 10) : '',
            assignedTo: updated.assignedTo || '',
          };
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Failed to update task.';
        this.messageType = 'error';
      },
    });
  }

  returnToMain(): void {
    this.router.navigate(['/']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../task';
import { Task } from '../models/task';

type MessageType = 'success' | 'error' | '';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-task.html',
  styleUrls: ['./update-task.css'],
})
export class UpdateTaskComponent implements OnInit {
  tasks: Task[] = [];
  selectedTaskId = '';
  loading = false;
  taskLoaded = false;

  task: any = null;

  message = '';
  messageType: MessageType = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: () => {
        this.message = 'Failed to load tasks.';
        this.messageType = 'error';
      },
    });
  }

  loadTask(): void {
    this.clearMessage();
    this.taskLoaded = false;

    if (!this.selectedTaskId) {
      this.message = 'Please select a task.';
      this.messageType = 'error';
      return;
    }

    this.taskService.getTaskById(this.selectedTaskId).subscribe({
      next: (data: any) => {
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
        this.message = err?.error?.message || 'Failed to load task.';
        this.messageType = 'error';
      },
    });
  }

  updateTask(event?: Event): void {
    event?.preventDefault();
    this.clearMessage();

    if (!this.selectedTaskId) {
      this.message = 'Please select a task.';
      this.messageType = 'error';
      return;
    }

    if (!this.task?.title?.trim() || !this.task?.status || !this.task?.priority) {
      this.message = 'Title, Status, and Priority are required.';
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

    this.taskService.updateTask(this.selectedTaskId, payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = '✅ Task updated successfully!';
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

        this.loadTasks();
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || err?.message || 'Failed to update task.';
        this.messageType = 'error';
      },
    });
  }

  returnToMain(): void {
    this.router.navigate(['/']);
  }
}

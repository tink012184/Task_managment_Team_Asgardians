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
  loadingTasks = false;
  taskLoaded = false;

  task: Partial<Task> = {
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
  };

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
    this.clearMessage();
    this.loadingTasks = true;
    this.tasks = [];

    this.taskService.getAllTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.loadingTasks = false;
      },
      error: (err: any) => {
        this.loadingTasks = false;
        this.message = err?.error?.message || 'Failed to load tasks.';
        this.messageType = 'error';
      },
    });
  }

  onTaskSelected(): void {
    if (!this.selectedTaskId) {
      this.taskLoaded = false;
      this.task = {
        title: '',
        description: '',
        status: '',
        priority: '',
        dueDate: '',
      };
      return;
    }

    this.loadTask();
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
      next: (data: Task) => {
        this.task = {
          title: data.title || '',
          description: data.description || '',
          status: data.status || '',
          priority: data.priority || '',
          dueDate: data.dueDate ? String(data.dueDate).substring(0, 10) : '',
        };

        this.taskLoaded = true;
      },
      error: (err: any) => {
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

    if (!this.task.title?.trim() || !this.task.status || !this.task.priority) {
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
            dueDate: updated.dueDate ? String(updated.dueDate).substring(0, 10) : '',
          };
        }

        this.loadTasks();
      },
      error: (err: any) => {
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

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { TaskService } from '../task';
import { Task } from '../models/task';

type MessageType = 'success' | 'error' | '';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './update-task.html',
  styleUrls: ['./update-task.css'],
})
export class UpdateTaskComponent implements OnInit {
  tasks: Task[] = [];
  selectedTaskId = '';
  selectedTask: Task | null = null;

  loadingTasks = false;
  loadingTask = false;
  submitting = false;
  taskLoaded = false;

  successMessage = '';
  errorMessage = '';

  // added for spec compatibility
  message = '';
  messageType: MessageType = '';

  // added for spec compatibility
  task: Task = {
    _id: '',
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: null,
    assignedTo: '',
  };

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private syncMessages(): void {
    if (this.messageType === 'success') {
      this.successMessage = this.message;
      this.errorMessage = '';
    } else if (this.messageType === 'error') {
      this.errorMessage = this.message;
      this.successMessage = '';
    } else {
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  private setSuccess(msg: string): void {
    this.message = msg;
    this.messageType = 'success';
    this.syncMessages();
  }

  private setError(msg: string): void {
    this.message = msg;
    this.messageType = 'error';
    this.syncMessages();
  }

  private clearMessages(): void {
    this.message = '';
    this.messageType = '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  loadTasks(): void {
    this.loadingTasks = true;
    this.clearMessages();
    this.cdr.detectChanges();

    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks || [];
        this.loadingTasks = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load tasks:', err);
        this.loadingTasks = false;
        this.setError('Failed to load tasks.');
        this.cdr.detectChanges();
      },
    });
  }

  onTaskSelected(taskId: string): void {
    this.clearMessages();
    this.selectedTaskId = taskId;

    if (!taskId) {
      this.selectedTask = null;
      this.taskLoaded = false;
      this.loadingTask = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadTask(taskId);
  }

  // optional parameter so old spec calling loadTask() still works
  loadTask(taskId?: string): void {
    const id = taskId || this.selectedTaskId;

    if (!id) {
      this.selectedTask = null;
      this.taskLoaded = false;
      this.setError('Please select a task.');
      this.cdr.detectChanges();
      return;
    }

    this.loadingTask = true;
    this.selectedTask = null;
    this.taskLoaded = false;
    this.clearMessages();
    this.cdr.detectChanges();

    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        const normalizedTask: Task = {
          ...task,
          dueDate: task.dueDate ? String(task.dueDate).split('T')[0] : null,
        };

        this.selectedTask = normalizedTask;
        this.task = { ...normalizedTask };
        this.selectedTaskId = normalizedTask._id || id;
        this.loadingTask = false;
        this.taskLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load task:', err);
        this.loadingTask = false;
        this.taskLoaded = false;
        this.setError('Failed to load selected task.');
        this.cdr.detectChanges();
      },
    });
  }

  updateTask(): void {
    // support either selectedTask or task so spec and template both work
    const currentTask = this.selectedTask ?? this.task;
    const taskId = currentTask?._id || this.selectedTaskId;

    if (!currentTask || !taskId) {
      this.setError('Please select a task first.');
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.clearMessages();
    this.cdr.detectChanges();

    this.taskService.updateTask(taskId, currentTask).subscribe({
      next: () => {
        this.submitting = false;
        this.selectedTask = { ...currentTask };
        this.task = { ...currentTask };
        this.taskLoaded = true;

        this.loadTasks();
        this.setSuccess('✅ Task updated successfully!');
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to update task:', err);
        this.submitting = false;

        const serverMessage = err?.error?.message || err?.message || 'Server error';

        this.setError(serverMessage);
        this.cdr.detectChanges();
      },
    });
  }
}

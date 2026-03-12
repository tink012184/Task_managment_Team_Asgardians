import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { TaskService } from '../task';
import { Task } from '../models/task';

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

  successMessage = '';
  errorMessage = '';

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loadingTasks = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.loadingTasks = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load tasks:', err);
        this.errorMessage = 'Failed to load tasks.';
        this.loadingTasks = false;
        this.cdr.detectChanges();
      },
    });
  }

  onTaskSelected(taskId: string): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.selectedTaskId = taskId;

    if (!taskId) {
      this.selectedTask = null;
      this.loadingTask = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadTask(taskId);
  }

  loadTask(taskId: string): void {
    this.loadingTask = true;
    this.selectedTask = null;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.taskService.getTaskById(taskId).subscribe({
      next: (task: Task) => {
        this.selectedTask = {
          ...task,
          dueDate: task.dueDate ? String(task.dueDate).split('T')[0] : null,
        };
        this.loadingTask = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load task:', err);
        this.errorMessage = 'Failed to load selected task.';
        this.loadingTask = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateTask(): void {
    if (!this.selectedTask || !this.selectedTask._id) {
      this.errorMessage = 'Please select a task first.';
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.taskService.updateTask(this.selectedTask._id, this.selectedTask).subscribe({
      next: () => {
        this.successMessage = 'Task updated successfully.';
        this.submitting = false;
        this.loadTasks();
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to update task:', err);
        this.errorMessage = 'Failed to update task.';
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}

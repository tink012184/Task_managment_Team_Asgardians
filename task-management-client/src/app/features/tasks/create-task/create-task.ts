import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../task';
import { Task } from '../models/task';

type MessageType = '' | 'success' | 'error';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css'],
})
export class CreateTaskComponent {
  task: Task = {
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Low',
    dueDate: '',
  };

  message = '';
  messageType: MessageType = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}

  goHome() {
    this.router.navigateByUrl('/');
  }

  onSubmit(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Basic validation
    if (!this.task.title?.trim() || !this.task.status || !this.task.priority) {
      this.messageType = 'error';
      this.message = 'Title, Status, and Priority are required.';
      return;
    }

    this.taskService.createTask(this.task).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = '✅ Task created successfully!';
        this.task = {
          title: '',
          description: '',
          status: 'Pending',
          priority: 'Low',
          dueDate: '',
        };
      },
      error: (err) => {
        this.messageType = 'error';
        this.message = err?.error?.message || 'Failed to create task.';
      },
    });
  }
}

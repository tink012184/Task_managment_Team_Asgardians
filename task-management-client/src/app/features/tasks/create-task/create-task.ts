import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task';
import { Task } from '../models/task';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css'],
})
export class CreateTaskComponent {
  task: Task = {
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Low',
  };

  message = '';

  constructor(private taskService: TaskService) {}

  onSubmit() {
    if (!this.task.title || !this.task.status || !this.task.priority) {
      this.message = 'Title, Status, and Priority are required.';
      return;
    }

    this.taskService.createTask(this.task).subscribe({
      next: () => {
        this.message = 'Task created successfully!';
        this.task = {
          title: '',
          description: '',
          status: 'Pending',
          priority: 'Low',
        };
      },
      error: (err) => {
        this.message = err.error.message;
      },
    });
  }
}

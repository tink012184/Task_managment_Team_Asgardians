import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TaskService } from '../task';
import { Task } from '../models/task';

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-tasks.html',
  styleUrls: ['./list-tasks.css'],
})
export class ListTasksComponent {
  errorMessage = '';
  tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks().pipe(
      catchError(() => {
        this.errorMessage = 'Failed to load tasks.';
        return of([]);
      }),
    );
  }
}

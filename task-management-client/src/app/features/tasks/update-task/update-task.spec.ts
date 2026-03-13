import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

import { UpdateTaskComponent } from './update-task';
import { TaskService } from '../task';

class FakeTaskService {
  getTasks() {
    return of([
      {
        _id: 'abc123',
        title: 'Existing Task',
        description: 'Existing Description',
        status: 'Pending',
        priority: 'Low',
      },
    ]);
  }

  getAllTasks() {
    return this.getTasks();
  }

  getTaskById(id: string) {
    return of({
      _id: id,
      title: 'Existing Task',
      description: 'Existing Description',
      status: 'Pending',
      priority: 'Low',
    });
  }

  updateTask(id: string, payload: any) {
    return of({
      _id: id,
      ...payload,
    });
  }
}

describe('UpdateTaskComponent', () => {
  let component: UpdateTaskComponent;
  let fixture: ComponentFixture<UpdateTaskComponent>;
  let taskService: FakeTaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTaskComponent],
      providers: [provideRouter([]), { provide: TaskService, useClass: FakeTaskService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTaskComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as unknown as FakeTaskService;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should show validation message when no task is selected', () => {
    component.selectedTaskId = '';
    component.loadTask();

    expect(component.message).toBe('Please select a task.');
    expect(component.messageType).toBe('error');
  });

  it('should show success message on successful update', () => {
    component.selectedTaskId = 'abc123';
    component.task = {
      _id: 'abc123',
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'In Progress',
      priority: 'High',
    } as any;

    component.updateTask();

    expect(component.message).toBe('✅ Task updated successfully!');
    expect(component.messageType).toBe('success');
  });

  it('should show error message if update service throws an error', () => {
    taskService.updateTask = () => throwError(() => ({ error: { message: 'Server error' } }));

    component.selectedTaskId = 'abc123';
    component.task = {
      _id: 'abc123',
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'In Progress',
      priority: 'High',
    } as any;

    component.updateTask();

    expect(component.message).toBe('Server error');
    expect(component.messageType).toBe('error');
  });
});

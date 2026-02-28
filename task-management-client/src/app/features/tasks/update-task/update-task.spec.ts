import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

import { UpdateTaskComponent } from './update-task';
import { TaskService } from '../task';

/* ✅ Manual fake service (same style as CreateTask tests) */
class FakeTaskService {
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

    await fixture.whenStable();
  });

  // ✅ TEST 1: Load validation
  it('should show validation message when Task ID is missing', () => {
    component.taskId = '';
    component.loadTask();

    expect(component.message).toBe('Task ID is required.');
  });

  // ✅ TEST 2: Successful update
  it('should show success message on successful update', () => {
    component.taskId = 'abc123';
    component.task = {
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'In Progress',
      priority: 'High',
    } as any;

    component.saveTask();

    expect(component.message).toBe('✅ Task updated successfully!');
    expect(component.messageType).toBe('success');
  });

  // ✅ TEST 3: Error on update
  it('should show error message if update service throws an error', () => {
    // override only this test (same as your CreateTask pattern)
    taskService.updateTask = () => throwError(() => ({ error: { message: 'Server error' } }));

    component.taskId = 'abc123';
    component.task = {
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'In Progress',
      priority: 'High',
    } as any;

    component.saveTask();

    expect(component.message).toBe('Server error');
    expect(component.messageType).toBe('error');
  });
});

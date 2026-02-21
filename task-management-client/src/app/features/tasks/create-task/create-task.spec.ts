import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CreateTaskComponent } from './create-task';
import { TaskService } from '../task';

/* ✅ Manual fake service */
class FakeTaskService {
  createTask(task: any) {
    return of({});
  }
}

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;
  let taskService: FakeTaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTaskComponent],
      providers: [{ provide: TaskService, useClass: FakeTaskService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTaskComponent);
    component = fixture.componentInstance;

    taskService = TestBed.inject(TaskService) as unknown as FakeTaskService;

    await fixture.whenStable();
  });

  it('should show validation message when required fields are missing', () => {
    component.task = {
      title: '',
      description: 'desc',
      status: 'Pending',
      priority: 'Low',
    };

    component.onSubmit();

    expect(component.message).toBe('Title, Status, and Priority are required.');
  });

  it('should show success message and reset form on successful submit', () => {
    component.task = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'Pending',
      priority: 'Low',
    };

    component.onSubmit();

    expect(component.message).toBe('Task created successfully!');
    expect(component.task.title).toBe('');
    expect(component.task.description).toBe('');
    expect(component.task.status).toBe('Pending');
    expect(component.task.priority).toBe('Low');
  });

  it('should show error message if service throws an error', () => {
    // Override the fake service method for this test
    taskService.createTask = () => throwError(() => ({ error: { message: 'Server error' } }));

    component.task = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'Pending',
      priority: 'Low',
    };

    component.onSubmit();

    expect(component.message).toBe('Server error');
  });
});

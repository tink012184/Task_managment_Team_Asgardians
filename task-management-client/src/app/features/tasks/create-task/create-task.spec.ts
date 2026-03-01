import '@angular/compiler';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CreateTaskComponent } from './create-task';
import { TaskService } from '../task';

function makeSpy() {
  const fn: any = (...args: any[]) => {
    fn.calls.push(args);
    return fn.impl ? fn.impl(...args) : null; // return null instead of undefined
  };
  fn.calls = [] as any[];
  fn.impl = null as any;
  fn.setImpl = (impl: any) => (fn.impl = impl);
  return fn;
}

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;

  let createTaskSpy: ReturnType<typeof makeSpy>;
  let navigateSpy: ReturnType<typeof makeSpy>;

  let taskServiceStub: Partial<TaskService>;
  let routerStub: Partial<Router>;

  beforeEach(() => {
    createTaskSpy = makeSpy();
    navigateSpy = makeSpy();

    taskServiceStub = {
      createTask: createTaskSpy as any,
    };

    routerStub = {
      navigate: navigateSpy as any,
    };

    // ✅ your component needs (taskService, router)
    component = new CreateTaskComponent(taskServiceStub as TaskService, routerStub as Router);
  });

  it('does not call service when title is empty', () => {
    // IMPORTANT: adjust these lines to match your actual component model
    // If your component uses component.task.title, keep it.
    // If it uses a form, update accordingly.
    component.task.title = '   ';
    component.task.status = 'Pending';
    component.task.priority = 'High';

    component.onSubmit();

    expect(createTaskSpy.calls.length).toBe(0);
    expect(component.message).toBeTruthy();
  });

  it('calls createTask and sets message on success', () => {
    component.task.title = 'New Task';
    component.task.description = 'Test description';
    component.task.status = 'Pending';
    component.task.priority = 'High';

    createTaskSpy.setImpl(() => of({}));

    component.onSubmit();

    expect(createTaskSpy.calls.length).toBe(1);
    expect(component.message).toBeTruthy();
    // if your component navigates after create
    // expect(navigateSpy.calls.length).toBe(1);
  });

  it('shows API error message on failure', () => {
    component.task.title = 'Duplicate Title';
    component.task.status = 'Pending';
    component.task.priority = 'High';

    createTaskSpy.setImpl(() =>
      throwError(() => ({ error: { message: 'Title must be unique.' } })),
    );

    component.onSubmit();

    expect(createTaskSpy.calls.length).toBe(1);
    expect(component.message).toBe('Title must be unique.');
  });
});

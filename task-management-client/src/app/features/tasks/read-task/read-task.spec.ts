import '@angular/compiler';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ReadTaskComponent } from './read-task';
import { TaskService } from '../task';

describe('ReadTaskComponent', () => {
  let component: ReadTaskComponent;
  let taskServiceSpy: { getTaskById: Mock };

  beforeEach(() => {
    taskServiceSpy = {
      getTaskById: vi.fn(),
    };

    component = new ReadTaskComponent(taskServiceSpy as unknown as TaskService);
  });

  // Test 1: Confirms an empty/blank task ID shows a required message and does not call the API.
  it('shows required message when task id is empty', () => {
    component.taskId = '   ';

    component.onSearch();

    expect(taskServiceSpy.getTaskById).not.toHaveBeenCalled();
    expect(component.task).toBeNull();
    expect(component.message).toBe('Task ID is required.');
  });

  // Test 2: Confirms a successful API response stores the task data and clears any message.
  it('loads task details when search succeeds', () => {
    const task = {
      _id: 'TK01',
      title: 'Read API',
      description: 'Fetch task by id',
      status: 'Pending' as const,
      priority: 'High' as const,
    };

    component.taskId = 'TK01';
    taskServiceSpy.getTaskById.mockReturnValue(of(task));

    component.onSearch();

    expect(taskServiceSpy.getTaskById).toHaveBeenCalledWith('TK01');
    expect(component.task).toEqual(task);
    expect(component.message).toBe('');
  });

  // Test 3: Confirms an API failure clears task data and shows the server error message.
  it('shows API message when search fails', () => {
    component.taskId = 'TK99';
    taskServiceSpy.getTaskById.mockReturnValue(
      throwError(() => ({ error: { message: 'Task not found.' } })),
    );

    component.onSearch();

    expect(taskServiceSpy.getTaskById).toHaveBeenCalledWith('TK99');
    expect(component.task).toBeNull();
    expect(component.message).toBe('Task not found.');
  });
});

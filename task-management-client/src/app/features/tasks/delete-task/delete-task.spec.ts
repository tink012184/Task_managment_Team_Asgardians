import '@angular/compiler';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { DeleteTaskComponent } from './delete-task';
import { TaskService } from '../task';

describe('DeleteTaskComponent', () => {
  let component: DeleteTaskComponent;
  let taskServiceSpy: { deleteTask: Mock };

  beforeEach(() => {
    taskServiceSpy = {
      deleteTask: vi.fn(),
    };

    component = new DeleteTaskComponent(taskServiceSpy as unknown as TaskService);
  });

  it('shows required message when task id is empty', () => {
    component.taskId = '   ';

    component.onDelete();

    expect(taskServiceSpy.deleteTask).not.toHaveBeenCalled();
    expect(component.message).toBe('Task ID is required.');
  });

  it('shows success message and clears task id when delete succeeds', () => {
    component.taskId = 'TK01';
    taskServiceSpy.deleteTask.mockReturnValue(of({ message: 'Task deleted successfully.' }));

    component.onDelete();

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('TK01');
    expect(component.message).toBe('Task deleted successfully.');
    expect(component.taskId).toBe('');
  });

  it('shows API error message when delete fails', () => {
    component.taskId = 'TK99';
    taskServiceSpy.deleteTask.mockReturnValue(
      throwError(() => ({ error: { message: 'Task not found.' } })),
    );

    component.onDelete();

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('TK99');
    expect(component.message).toBe('Task not found.');
  });
});

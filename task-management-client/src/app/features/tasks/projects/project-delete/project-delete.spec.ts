import '@angular/compiler';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ProjectDeleteComponent } from './project-delete';
import { ProjectService } from '../project.service';

describe('ProjectDeleteComponent', () => {
  let component: ProjectDeleteComponent;
  let projectServiceSpy: { deleteProject: Mock };

  beforeEach(() => {
    projectServiceSpy = {
      deleteProject: vi.fn(),
    };

    component = new ProjectDeleteComponent(projectServiceSpy as unknown as ProjectService);
  });

  // Verifies empty input is blocked before hitting the API.
  it('shows required message when project id is empty', () => {
    component.projectId = '   ';

    component.onDelete();

    expect(projectServiceSpy.deleteProject).not.toHaveBeenCalled();
    expect(component.message).toBe('Project ID is required.');
  });

  // Verifies successful deletion shows confirmation and clears input.
  it('shows success message and clears project id when delete succeeds', () => {
    component.projectId = '507f1f77bcf86cd799439011';
    projectServiceSpy.deleteProject.mockReturnValue(of({ message: 'Project deleted successfully.' }));

    component.onDelete();

    expect(projectServiceSpy.deleteProject).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(component.message).toBe('Project deleted successfully.');
    expect(component.projectId).toBe('');
  });

  // Verifies API failures display the backend error message.
  it('shows API error message when delete fails', () => {
    component.projectId = '507f1f77bcf86cd799439099';
    projectServiceSpy.deleteProject.mockReturnValue(
      throwError(() => ({ error: { message: 'Project not found.' } })),
    );

    component.onDelete();

    expect(projectServiceSpy.deleteProject).toHaveBeenCalledWith('507f1f77bcf86cd799439099');
    expect(component.message).toBe('Project not found.');
  });
});

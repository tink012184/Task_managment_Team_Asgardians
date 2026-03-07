import '@angular/compiler';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ProjectReadComponent } from './project-read.component';
import { ProjectService } from '../project.service';

describe('ProjectReadComponent', () => {
  let component: ProjectReadComponent;
  let projectServiceSpy: { getProjectById: Mock };

  beforeEach(() => {
    projectServiceSpy = {
      getProjectById: vi.fn(),
    };

    component = new ProjectReadComponent(projectServiceSpy as unknown as ProjectService);
  });

  // Verifies that blank input gets rejected and no API call is made.
  it('shows required message when project id is empty', () => {
    component.projectId = '   ';

    component.onSearch();

    expect(projectServiceSpy.getProjectById).not.toHaveBeenCalled();
    expect(component.project).toBeNull();
    expect(component.message).toBe('Project ID is required.');
  });

  // Verifies that a successful API response stores and displays the project.
  it('loads project details when search succeeds', () => {
    const project = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Project Alpha',
      description: 'Read project by id',
      startDate: '2026-03-06',
    };

    component.projectId = '507f1f77bcf86cd799439011';
    projectServiceSpy.getProjectById.mockReturnValue(of(project));

    component.onSearch();

    expect(projectServiceSpy.getProjectById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(component.project).toEqual(project);
    expect(component.message).toBe('');
  });

  // Verifies that an API error clears project data and shows the server message.
  it('shows API message when search fails', () => {
    component.projectId = '507f1f77bcf86cd799439099';
    projectServiceSpy.getProjectById.mockReturnValue(
      throwError(() => ({ error: { message: 'Project not found.' } })),
    );

    component.onSearch();

    expect(projectServiceSpy.getProjectById).toHaveBeenCalledWith('507f1f77bcf86cd799439099');
    expect(component.project).toBeNull();
    expect(component.message).toBe('Project not found.');
  });
});

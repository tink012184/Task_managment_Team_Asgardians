import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProjectUpdateComponent } from './project-update';
import { ProjectService } from '../project.service';

class FakeProjectService {
  getProjectById(id: string) {
    return of({
      _id: id,
      name: 'Project Alpha',
      description: 'Existing project description',
      startDate: '2026-03-12',
    });
  }

  updateProject(id: string, payload: any) {
    return of({
      _id: id,
      ...payload,
    });
  }
}

describe('ProjectUpdateComponent', () => {
  let component: ProjectUpdateComponent;
  let fixture: ComponentFixture<ProjectUpdateComponent>;
  let projectService: FakeProjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectUpdateComponent],
      providers: [{ provide: ProjectService, useClass: FakeProjectService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectUpdateComponent);
    component = fixture.componentInstance;

    projectService = TestBed.inject(ProjectService) as unknown as FakeProjectService;

    await fixture.whenStable();
  });

  it('should show validation message when Project ID is missing', () => {
    component.projectId = '';

    component.loadProject();

    expect(component.error).toBe('Project ID is required.');
    expect(component.projectLoaded).toBeFalsy();
  });

  it('should show success message on successful update', () => {
    component.projectId = '507f1f77bcf86cd799439011';
    component.project = {
      name: 'Updated Project',
      description: 'Updated description',
      startDate: '2026-03-12',
    } as any;

    component.updateProject();

    expect(component.message).toBe('Project updated successfully.');
    expect(component.error).toBe('');
    expect(component.projectLoaded).toBe(true);
  });

  it('should show error message if update service throws an error', () => {
    projectService.updateProject = () =>
      throwError(() => ({ error: { message: 'Project not found.' } }));

    component.projectId = '507f1f77bcf86cd799439011';
    component.project = {
      name: 'Updated Project',
      description: 'Updated description',
      startDate: '2026-03-12',
    } as any;

    component.updateProject();

    expect(component.message).toBe('');
    expect(component.error).toBe('Project not found.');
  });
});

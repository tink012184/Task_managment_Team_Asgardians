import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

import { ProjectUpdateComponent } from './project-update';
import { ProjectService } from '../project.service';

class FakeProjectService {
  getAllProjects() {
    return of([
      {
        _id: 'proj123',
        name: 'Project Alpha',
        description: 'Existing project description',
        startDate: '2026-03-12',
      },
    ]);
  }

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
      providers: [provideRouter([]), { provide: ProjectService, useClass: FakeProjectService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectUpdateComponent);
    component = fixture.componentInstance;

    projectService = TestBed.inject(ProjectService) as unknown as FakeProjectService;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should show validation message when no project is selected', () => {
    component.selectedProjectId = '';
    component.loadProject();

    expect(component.message).toBe('Please select a project.');
    expect(component.messageType).toBe('error');
  });

  it('should show success message on successful update', () => {
    component.selectedProjectId = 'proj123';
    component.project = {
      name: 'Updated Project',
      description: 'Updated description',
      startDate: '2026-03-12',
    } as any;

    component.updateProject();

    expect(component.message).toBe('Project updated successfully.');
    expect(component.messageType).toBe('success');
  });

  it('should show error message if update service throws an error', () => {
    projectService.updateProject = () =>
      throwError(() => ({ error: { message: 'Project not found.' } }));

    component.selectedProjectId = 'proj123';
    component.project = {
      name: 'Updated Project',
      description: 'Updated description',
      startDate: '2026-03-12',
    } as any;

    component.updateProject();

    expect(component.message).toBe('Project not found.');
    expect(component.messageType).toBe('error');
  });
});

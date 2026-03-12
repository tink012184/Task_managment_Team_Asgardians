import '@angular/compiler';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ProjectCreateComponent } from './project-create.component';
import { ProjectService } from '../project.service';

function makeSpy() {
  const fn: any = (...args: any[]) => {
    fn.calls.push(args);
    return fn.impl ? fn.impl(...args) : null;
  };
  fn.calls = [] as any[];
  fn.impl = null as any;
  fn.setImpl = (impl: any) => (fn.impl = impl);
  return fn;
}

describe('ProjectCreateComponent', () => {
  let component: ProjectCreateComponent;

  let createProjectSpy: ReturnType<typeof makeSpy>;
  let navigateSpy: ReturnType<typeof makeSpy>;

  let projectServiceStub: Partial<ProjectService>;
  let routerStub: Partial<Router>;

  beforeEach(() => {
    createProjectSpy = makeSpy();
    navigateSpy = makeSpy();

    projectServiceStub = {
      createProject: createProjectSpy as any,
    };

    routerStub = {
      navigate: navigateSpy as any,
    };

    component = new ProjectCreateComponent(projectServiceStub as ProjectService, routerStub as Router);
  });

  it('does not call service when required fields are missing', () => {
    component.project.name = '';
    component.project.description = '';
    component.project.startDate = '';

    component.submitProject();

    expect(createProjectSpy.calls.length).toBe(0);
    expect(component.error).toBe('All fields are required.');
  });

  it('calls createProject and sets success message on success', () => {
    component.project.name = 'New Project';
    component.project.description = 'Test description';
    component.project.startDate = '2026-03-06';

    createProjectSpy.setImpl(() => of({}));

    component.submitProject();

    expect(createProjectSpy.calls.length).toBe(1);
    expect(component.message).toBe('Project created successfully.');
  });

  it('shows error message when API call fails', () => {
    component.project.name = 'New Project';
    component.project.description = 'Test description';
    component.project.startDate = '2026-03-06';

    createProjectSpy.setImpl(() => throwError(() => new Error('API failure')));

    component.submitProject();

    expect(createProjectSpy.calls.length).toBe(1);
    expect(component.error).toBe('Failed to create project.');
  });
});

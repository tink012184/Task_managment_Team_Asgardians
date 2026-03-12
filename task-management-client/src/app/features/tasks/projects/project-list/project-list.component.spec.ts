import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProjectListComponent } from './project-list.component';
import { environment } from '../../../../../enviroments/enviroment';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.projectApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    expect(component).toBeTruthy();
  });

  it('should render project names when API returns projects', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.projectApiUrl);
    req.flush([
      { _id: '1', name: 'Project Alpha', description: 'Desc A', startDate: '2026-03-12' },
      { _id: '2', name: 'Project Beta', description: 'Desc B', startDate: '2026-03-13' },
    ]);

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Project Alpha');
    expect(compiled.textContent).toContain('Project Beta');
  });

  it('should show "No projects found." when API returns empty', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.projectApiUrl);
    req.flush([]);

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('No projects found.');
  });
});

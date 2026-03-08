import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProjectListComponent } from './project-list.component';

describe('ProjectListComponent', () => {
  let fixture: ComponentFixture<ProjectListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:3000/api/projects');
    req.flush([]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render project names when API returns projects', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:3000/api/projects');
    req.flush([{ _id: '1', name: 'Project A' }, { _id: '2', name: 'Project B' }]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Project A');
    expect(el.textContent).toContain('Project B');
  });

  it('should show \"No projects found.\" when API returns empty', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:3000/api/projects');
    req.flush([]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No projects found.');
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectSearchComponent } from './project-search.component';

describe('ProjectSearchComponent', () => {
  let fixture: ComponentFixture<ProjectSearchComponent>;
  let component: ProjectSearchComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSearchComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the search endpoint and render results', () => {
    component.query = 'test';
    component.search();

    const req = httpMock.expectOne('http://localhost:3000/api/projects/search?q=test');
    expect(req.request.method).toBe('GET');

    req.flush([{ _id: '1', name: 'Project A' }]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Project A');
  });

  it('should show "No results." when query is blank', () => {
    component.query = '   ';
    component.search();
    fixture.detectChanges();

    httpMock.expectNone('http://localhost:3000/api/projects/search?q=');

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No results.');
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProjectSearchComponent } from './project-search.component';

describe('ProjectSearchComponent', () => {
  let fixture: ComponentFixture<ProjectSearchComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSearchComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call the search endpoint and render results', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.query = 'test';
    component.search();
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/api/projects/search?q=test');
    req.flush([{ _id: '1', name: 'Project A' }]);

    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Project A');
  });

  it('should show "No results." when query is blank', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.query = '   ';
    component.search();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No results.');
  });
});

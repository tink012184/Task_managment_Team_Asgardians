import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { vi } from 'vitest';

import { SearchTasksComponent } from './search-tasks';
import { environment } from '../../../../enviroments/enviroment';

describe('SearchTasksComponent', () => {
  let component: SearchTasksComponent;
  let fixture: ComponentFixture<SearchTasksComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, SearchTasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTasksComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    vi.useFakeTimers();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call search endpoint and render results', () => {
    component.query = 'test';
    component.search();

    const req = httpMock.expectOne(
      `${environment.taskApiUrl}?search=${encodeURIComponent('test')}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush([
      { _id: '1', title: 'Matching Task', description: '', status: 'Pending', priority: 'Low' },
    ]);

    vi.runAllTimers();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Matching Task');
  });

  it('should show "No results." when API returns empty', () => {
    component.query = 'test';
    component.search();

    const req = httpMock.expectOne(
      `${environment.taskApiUrl}?search=${encodeURIComponent('test')}`,
    );
    req.flush([]);

    vi.runAllTimers();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No results.');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { SearchTasksComponent } from './search-tasks';

describe('SearchTasksComponent', () => {
  let fixture: ComponentFixture<SearchTasksComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SearchTasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTasksComponent);
    httpMock = TestBed.inject(HttpTestingController);
    vi.useFakeTimers();
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call search endpoint and render results', async () => {
    const component = fixture.componentInstance;
    component.query = 'test';
    fixture.detectChanges();
    component.search();

    const req = httpMock.expectOne(
      'https://task-managment-team-asgardians-server.onrender.com/api/tasks/search?q=test',
    );
    req.flush([{ _id: '1', title: 'Task A' }]);
    vi.runAllTimers();

    vi.runAllTimers();
    await fixture.whenStable();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Task A');
  });

  it('should show "No results." when API returns empty', async () => {
    const component = fixture.componentInstance;
    component.query = 'xyz';
    fixture.detectChanges();
    component.search();

    const req = httpMock.expectOne(
      'https://task-managment-team-asgardians-server.onrender.com/api/tasks/search?q=xyz',
    );
    req.flush([]);
    vi.runAllTimers();
    await fixture.whenStable();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No results.');
  });
});

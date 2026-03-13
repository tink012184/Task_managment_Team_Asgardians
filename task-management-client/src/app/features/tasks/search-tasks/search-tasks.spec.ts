import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SearchTasksComponent } from './search-tasks';

describe('SearchTasksComponent', () => {
  let component: SearchTasksComponent;
  let fixture: ComponentFixture<SearchTasksComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTasksComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTasksComponent);
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

  it('should call search endpoint and render results', () => {
    component.query = 'test';
    component.searchTasks();

    const req = httpMock.expectOne('http://localhost:3000/api/tasks/search?q=test');
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        _id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'Pending',
        priority: 'High',
      },
    ]);

    fixture.detectChanges();

    expect(component.results.length).toBe(1);
    expect(component.results[0].title).toBe('Test Task');
  });

  it('should show "No results." when API returns empty', () => {
    component.query = 'test';
    component.searchTasks();

    const req = httpMock.expectOne('http://localhost:3000/api/tasks/search?q=test');
    expect(req.request.method).toBe('GET');

    req.flush([]);

    fixture.detectChanges();

    expect(component.results.length).toBe(0);
    expect(component.message).toBe('No results.');
  });
});

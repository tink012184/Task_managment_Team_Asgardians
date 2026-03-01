import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ListTasksComponent } from './list-tasks';

describe('ListTasksComponent', () => {
  let fixture: ComponentFixture<ListTasksComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ListTasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListTasksComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:3000/api/tasks');
    req.flush([]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render task titles when API returns tasks', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/api/tasks');
    req.flush([
      { _id: '1', title: 'Task A', status: 'Pending', priority: 'Low' },
      { _id: '2', title: 'Task B', status: 'In Progress', priority: 'High' },
    ]);

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Task A');
    expect(el.textContent).toContain('Task B');
  });

  it('should show "No tasks found." when API returns empty array', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/api/tasks');
    req.flush([]);

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No tasks found.');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ListTasksComponent } from './list-tasks';
import { environment } from '../../../../enviroments/enviroment';

describe('ListTasksComponent', () => {
  let component: ListTasksComponent;
  let fixture: ComponentFixture<ListTasksComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ListTasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListTasksComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.taskApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    expect(component).toBeTruthy();
  });

  it('should render task titles when API returns tasks', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.taskApiUrl);
    req.flush([
      { _id: '1', title: 'Task One', description: '', status: 'Pending', priority: 'Low' },
      { _id: '2', title: 'Task Two', description: '', status: 'Done', priority: 'High' },
    ]);

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Task One');
    expect(compiled.textContent).toContain('Task Two');
  });

  it('should show "No tasks found." when API returns empty array', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.taskApiUrl);
    req.flush([]);

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('No tasks found.');
  });
});

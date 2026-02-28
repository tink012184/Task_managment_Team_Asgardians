import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: 'tasks/create',
    loadComponent: () =>
      import('./features/tasks/create-task/create-task').then((m) => m.CreateTaskComponent),
  },
  {
    path: 'tasks/read',
    loadComponent: () =>
      import('./features/tasks/read-task/read-task').then((m) => m.ReadTaskComponent),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/list-tasks/list-tasks').then((m) => m.ListTasksComponent),
  },
];

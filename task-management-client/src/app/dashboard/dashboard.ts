import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type DashboardItem = {
  title: string;
  description: string;
  route: string;
  status?: 'ready' | 'in-progress' | 'planned';
  owner?: string;
};

type DashboardSection = {
  name: string;
  items: DashboardItem[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {
  sections: DashboardSection[] = [
    {
      name: 'Tasks (Core)',
      items: [
        {
          title: 'Create Task',
          description: 'Add a new task (form view).',
          route: '/tasks/create',
          status: 'ready',
          owner: 'Student A',
        },
        {
          title: 'Read Task by ID',
          description: 'Find a task using its ID.',
          route: '/tasks/read',
          status: 'ready',
          owner: 'Student B',
        },
        {
          title: 'Delete Task by ID',
          description: 'Delete a task using its ID.',
          route: '/tasks/delete',
          status: 'ready',
          owner: 'Student B',
        },
        {
          title: 'Task List',
          description: 'View and manage all tasks.',
          route: '/tasks/list',
          status: 'ready',
          owner: 'Student C',
        },
        {
          title: 'Search Tasks',
          description: 'Search tasks by title/description.',
          route: '/tasks/search',
          status: 'ready',
          owner: 'Student C',
        },
      ],
    },
    {
      name: 'Projects',
      items: [
        {
          title: 'Create Project',
          description: 'Add a new project (form view).',
          route: '/projects/create',
          status: 'ready',
          owner: 'Student A',
        },
        {
          title: 'Read Project by ID',
          description: 'Find a project using its ID.',
          route: '/projects/read',
          status: 'ready',
          owner: 'Student B',
        },
        {
          title: 'Project List',
          description: 'View all projects.',
          route: '/projects/list',
          status: 'ready',
          owner: 'Student C',
        },
      ],
    },
    {
      name: 'Reports',
      items: [
        {
          title: 'Weekly Summary',
          description: 'Sprint/weekly view of tasks.',
          route: '/reports/weekly',
          status: 'planned',
          owner: 'Team',
        },
      ],
    },
    {
      name: 'Admin / Settings',
      items: [
        {
          title: 'Team Members',
          description: 'Manage members/roles (optional).',
          route: '/admin/members',
          status: 'planned',
          owner: 'Team',
        },
      ],
    },
  ];

  trackByName = (_: number, s: DashboardSection) => s.name;
  trackByRoute = (_: number, i: DashboardItem) => i.route;

  badgeClass(status?: DashboardItem['status']) {
    switch (status) {
      case 'ready':
        return 'badge badge--ready';
      case 'in-progress':
        return 'badge badge--progress';
      case 'planned':
        return 'badge badge--planned';
      default:
        return 'badge';
    }
  }

  badgeText(status?: DashboardItem['status']) {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'in-progress':
        return 'In progress';
      case 'planned':
        return 'Planned';
      default:
        return '';
    }
  }
}

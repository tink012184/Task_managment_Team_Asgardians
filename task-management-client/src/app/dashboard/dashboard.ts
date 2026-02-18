import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type DashboardItem = {
  title: string;
  description: string;
  route: string;
  status?: 'ready' | 'in-progress' | 'planned';
  owner?: string; // e.g., "Student A"
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
  // ✅ DROP-IN AREA:
  // Add new pages by adding items below (title/description/route).
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
          title: 'Task List',
          description: 'View and manage all tasks.',
          route: '/tasks',
          status: 'planned',
          owner: 'Team',
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

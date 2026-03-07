import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../projects.model';

@Component({
	selector: 'app-project-read',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './project-read.component.html',
	styleUrls: ['./project-read.component.css'],
})
export class ProjectReadComponent {
	projectId = '';
	project: Project | null = null;
	message = '';

	constructor(private projectService: ProjectService) {}

	onSearch(): void {
		const id = this.projectId.trim();

		// Form validation
		if (!id) {
			this.project = null;
			this.message = 'Project ID is required.';
			return;
		}

		// Fetch project by id from API
		this.projectService.getProjectById(id).subscribe({
			next: (project) => {
				this.project = project;
				this.message = '';
			},
			error: (err) => {
				// Show API-provided message when available
				this.project = null;
				this.message = err?.error?.message || 'Unable to load project.';
			},
		});
	}
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StrategicPlannerService } from '../../../services/strategic-planner.service';
import {
  ProjectDetail, Initiative, TeamMember, Release,
  ProjectStatus, ProjectPriority
} from '../../../models/strategic-planner.models';

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId: number | null = null;
  isLoading = false;
  errorMessage = '';

  // Lookup data for dropdowns (matching APEX Page 24 LOVs)
  initiatives: Initiative[] = [];
  teamMembers: TeamMember[] = [];
  releases: Release[] = [];
  statuses: ProjectStatus[] = [];
  priorities: ProjectPriority[] = [];

  sizes = ['XS', 'S', 'M', 'L', 'XL'];
  pctOptions = Array.from({ length: 11 }, (_, i) => i * 10);

  constructor(
    private fb: FormBuilder,
    private plannerService: StrategicPlannerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(255)]],
      initiativeId: [null],
      ownerId: [null],
      projectSize: ['M'],
      priorityId: [null],
      pctComplete: [0],
      statusId: [null],
      targetComplete: [''],
      releaseId: [null],
      tags: [''],
      description: [''],
      url: [''],
      linkName: ['']
    });
  }

  ngOnInit(): void {
    // Load lookups
    this.plannerService.getInitiatives().subscribe(d => this.initiatives = d);
    this.plannerService.getTeamMembers().subscribe(d => this.teamMembers = d);
    this.plannerService.getReleases().subscribe(d => this.releases = d);
    this.plannerService.getStatuses().subscribe(d => this.statuses = d);
    this.plannerService.getPriorities().subscribe(d => this.priorities = d);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.projectId = +idParam;
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: number): void {
    this.isLoading = true;
    this.plannerService.getProject(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          projectName: project.projectName,
          initiativeId: project.initiativeId,
          ownerId: project.ownerId,
          projectSize: project.projectSize || 'M',
          priorityId: project.priorityId,
          pctComplete: project.pctComplete || 0,
          statusId: project.statusId,
          targetComplete: project.targetComplete ? this.formatDate(project.targetComplete) : '',
          releaseId: project.releaseId,
          tags: project.tags || '',
          description: project.description || '',
          url: project.url || '',
          linkName: project.linkName || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading project', err);
        this.errorMessage = 'Could not load project details.';
        this.isLoading = false;
      }
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  }

  saveProject(): void {
    if (this.projectForm.invalid) return;

    this.isLoading = true;
    const formValue = this.projectForm.value;

    const projectData: Partial<ProjectDetail> = {
      ...formValue,
      id: this.projectId || 0,
      targetComplete: formValue.targetComplete ? new Date(formValue.targetComplete).toISOString() : null
    };

    if (this.isEditMode && this.projectId) {
      this.plannerService.updateProject(this.projectId, projectData).subscribe({
        next: () => this.router.navigate(['/sp-projects']),
        error: (err) => {
          console.error('Error updating project', err);
          this.errorMessage = 'Failed to update project.';
          this.isLoading = false;
        }
      });
    } else {
      this.plannerService.createProject(projectData).subscribe({
        next: () => this.router.navigate(['/sp-projects']),
        error: (err) => {
          console.error('Error creating project', err);
          this.errorMessage = 'Failed to create project.';
          this.isLoading = false;
        }
      });
    }
  }
}

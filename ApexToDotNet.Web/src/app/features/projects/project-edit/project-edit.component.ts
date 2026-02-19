import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project';

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

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(30)]],
      taskName: ['', [Validators.required, Validators.maxLength(255)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Pending', [Validators.required, Validators.maxLength(30)]],
      assignedTo: ['', Validators.maxLength(30)],
      cost: [null],
      budget: [null]
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.projectId = +idParam;
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: number): void {
    this.isLoading = true;
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        // Format dates for input[type="datetime-local"] or date
        // Assuming API returns ISO string, we might need to extract YYYY-MM-DD
        const formData = {
          ...project,
          startDate: this.formatDate(project.startDate),
          endDate: this.formatDate(project.endDate)
        };
        this.projectForm.patchValue(formData);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading project', err);
        this.errorMessage = 'Could not load project details.';
        this.isLoading = false;
      }
    });
  }

  private formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.projectForm.value;
    
    // Construct payload
    const projectData: Project = {
      ...formValue,
      id: this.projectId || 0,
      // Ensure time component is handled if needed, for now just taking the date
      startDate: new Date(formValue.startDate).toISOString(),
      endDate: new Date(formValue.endDate).toISOString()
    };

    if (this.isEditMode && this.projectId) {
      this.projectService.updateProject(this.projectId, projectData).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          console.error('Error updating project', err);
          this.errorMessage = 'Failed to update project.';
          this.isLoading = false;
        }
      });
    } else {
      this.projectService.createProject(projectData).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          console.error('Error creating project', err);
          this.errorMessage = 'Failed to create project.';
          this.isLoading = false;
        }
      });
    }
  }

  // Custom validator to ensure StartDate <= EndDate
  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    return start && end && new Date(start) > new Date(end) ? { dateRangeInvalid: true } : null;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { Session } from '../../../models/session';

@Component({
  selector: 'app-session-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './session-edit.component.html',
  styleUrls: ['./session-edit.component.css']
})
export class SessionEditComponent implements OnInit {
  sessionForm: FormGroup;
  isEditMode = false;
  sessionId: number | null = null;
  isLoading = false;
  errorMessage = '';
  
  // Logic from APEX: Hide Speaker if Type is BREAK
  showSpeaker = true;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      sessionType: ['General', [Validators.required, Validators.maxLength(30)]],
      speaker: ['', Validators.maxLength(255)],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Active', [Validators.required, Validators.maxLength(30)]]
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.sessionId = +idParam;
      this.loadSession(this.sessionId);
    }
    
    // Watch for Session Type changes to toggle Speaker field
    this.sessionForm.get('sessionType')?.valueChanges.subscribe(value => {
      this.showSpeaker = value !== 'Break';
      if (!this.showSpeaker) {
        this.sessionForm.get('speaker')?.setValue(null);
      }
    });
  }

  loadSession(id: number): void {
    this.isLoading = true;
    this.sessionService.getSession(id).subscribe({
      next: (session) => {
        const formData = {
            ...session,
            startDate: this.formatDateTime(session.startDate), // datetime-local format
            endDate: this.formatDateTime(session.endDate)
        };
        this.sessionForm.patchValue(formData);
        
        // Initial check for speaker visibility
        this.showSpeaker = session.sessionType !== 'Break';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading session', err);
        this.errorMessage = 'Could not load session details.';
        this.isLoading = false;
      }
    });
  }
  
  private formatDateTime(dateString: string): string {
      if (!dateString) return '';
      // Slice off seconds/ms for datetime-local input compatibility (YYYY-MM-DDTHH:mm)
      return new Date(dateString).toISOString().slice(0, 16);
  }

  saveSession(): void {
    if (this.sessionForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.sessionForm.value;
    
    const sessionData: Session = {
      ...formValue,
      id: this.sessionId || 0,
      startDate: new Date(formValue.startDate).toISOString(),
      endDate: new Date(formValue.endDate).toISOString()
    };

    if (this.isEditMode && this.sessionId) {
      this.sessionService.updateSession(this.sessionId, sessionData).subscribe({
        next: () => {
          this.router.navigate(['/sessions']);
        },
        error: (err) => {
          console.error('Error updating session', err);
          this.errorMessage = 'Failed to update session.';
          this.isLoading = false;
        }
      });
    } else {
      this.sessionService.createSession(sessionData).subscribe({
        next: () => {
          this.router.navigate(['/sessions']);
        },
        error: (err) => {
          console.error('Error creating session', err);
          this.errorMessage = 'Failed to create session.';
          this.isLoading = false;
        }
      });
    }
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    return start && end && new Date(start) > new Date(end) ? { dateRangeInvalid: true } : null;
  }
}

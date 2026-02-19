import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { Initiative } from '../../models/strategic-planner.models';

@Component({
  selector: 'app-initiatives',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Initiatives</h1>
        <p class="page-subtitle">Major efforts driving progress</p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <div *ngIf="!loading" class="initiatives-grid">
        <div *ngFor="let initiative of initiatives" class="initiative-card">
          <div class="card-header">
            <h3 class="initiative-name">{{ initiative.name }}</h3>
            <div class="badges">
              <span class="priority-badge priority-{{ initiative.priority }}">
                P{{ initiative.priority }}
              </span>
              <span *ngIf="initiative.size" class="size-badge size-{{ initiative.size | lowercase }}">
                {{ initiative.size }}
              </span>
            </div>
          </div>
          
          <p class="initiative-description">{{ initiative.description || 'No description' }}</p>
          
          <div *ngIf="initiative.areaName" class="area-tag">
            🎯 {{ initiative.areaName }}
          </div>

          <div class="initiative-stats">
            <div class="stat-item">
              <span class="stat-icon">📋</span>
              <span class="stat-text">{{ initiative.projectCount || 0 }} projects</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">⚡</span>
              <span class="stat-text">{{ initiative.activityCount || 0 }} activities</span>
            </div>
          </div>

          <div *ngIf="initiative.startDate || initiative.endDate" class="date-range">
            <span *ngIf="initiative.startDate">{{ formatDate(initiative.startDate) }}</span>
            <span *ngIf="initiative.startDate && initiative.endDate"> - </span>
            <span *ngIf="initiative.endDate">{{ formatDate(initiative.endDate) }}</span>
          </div>
        </div>

        <div *ngIf="initiatives.length === 0" class="empty-state">
          <span class="empty-icon">🚀</span>
          <p>No initiatives found</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 600;
      color: #212121;
      margin: 0 0 8px 0;
    }

    .page-subtitle {
      font-size: 16px;
      color: #757575;
      margin: 0;
    }

    .initiatives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .initiative-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .initiative-card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      transform: translateY(-4px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .initiative-name {
      font-size: 18px;
      font-weight: 600;
      color: #212121;
      margin: 0;
      flex: 1;
    }

    .badges {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .initiative-description {
      color: #616161;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .area-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #f5f5f5;
      border-radius: 16px;
      font-size: 13px;
      color: #424242;
      font-weight: 500;
      width: fit-content;
    }

    .initiative-stats {
      display: flex;
      gap: 20px;
      padding: 12px 0;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #616161;
    }

    .stat-icon {
      font-size: 16px;
    }

    .date-range {
      font-size: 13px;
      color: #757575;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 60px 20px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: #9e9e9e;
    }

    .empty-icon {
      font-size: 64px;
      display: block;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .initiatives-grid {
        grid-template-columns: 1fr;
      }

      .page-header h1 {
        font-size: 24px;
      }
    }
  `]
})
export class InitiativesComponent implements OnInit {
  initiatives: Initiative[] = [];
  loading = false;

  constructor(private plannerService: StrategicPlannerService) {}

  ngOnInit() {
    this.loadInitiatives();
  }

  loadInitiatives() {
    this.loading = true;
    this.plannerService.getInitiatives().subscribe({
      next: (data) => {
        this.initiatives = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading initiatives:', error);
        this.loading = false;
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}

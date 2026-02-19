import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { Area } from '../../models/strategic-planner.models';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Areas</h1>
        <p class="page-subtitle">Organize work into strategic areas</p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <div *ngIf="!loading" class="areas-grid">
        <div *ngFor="let area of areas" class="area-card" [routerLink]="['/projects']" [queryParams]="{areaId: area.id}">
          <div class="area-header">
            <div class="area-color" [style.background]="area.color || '#1976d2'"></div>
            <h3 class="area-name">{{ area.name }}</h3>
          </div>
          <p class="area-description">{{ area.description || 'No description' }}</p>
          <div class="area-stats">
            <div class="stat-item">
              <span class="stat-value">{{ area.projectCount || 0 }}</span>
              <span class="stat-label">Projects</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ area.initiativeCount || 0 }}</span>
              <span class="stat-label">Initiatives</span>
            </div>
          </div>
        </div>

        <div *ngIf="areas.length === 0" class="empty-state">
          <span class="empty-icon">🎯</span>
          <p>No areas found</p>
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

    .areas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .area-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s;
      cursor: pointer;
    }

    .area-card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      transform: translateY(-4px);
    }

    .area-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .area-color {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .area-name {
      font-size: 20px;
      font-weight: 600;
      color: #212121;
      margin: 0;
      flex: 1;
    }

    .area-description {
      color: #616161;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 20px 0;
      min-height: 42px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .area-stats {
      display: flex;
      gap: 24px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1976d2;
    }

    .stat-label {
      font-size: 12px;
      color: #757575;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
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
      .areas-grid {
        grid-template-columns: 1fr;
      }

      .page-header h1 {
        font-size: 24px;
      }
    }
  `]
})
export class AreasComponent implements OnInit {
  areas: Area[] = [];
  loading = false;

  constructor(private plannerService: StrategicPlannerService) {}

  ngOnInit() {
    this.loadAreas();
  }

  loadAreas() {
    this.loading = true;
    this.plannerService.getAreas().subscribe({
      next: (data) => {
        this.areas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading areas:', error);
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { Project } from '../../models/strategic-planner.models';

interface DashboardSection {
  title: string;
  count: number;
  route: string;
  icon: string;
  color: string;
}

interface RecentActivity {
  type: string;
  title: string;
  timestamp: Date;
  user: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home-container">
      <div class="welcome-section">
        <h1>Our Strategic Planner</h1>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search Projects"
            [(ngModel)]="searchQuery"
            (input)="onSearch()">
        </div>
      </div>

      <!-- My Initiatives -->
      <div class="section">
        <div class="section-header">
          <h2>My Initiatives</h2>
        </div>
        <div class="content-area">
          <div *ngIf="myInitiatives.length === 0" class="empty-state-inline">
            <span class="empty-icon-small">🔍</span>
            <p>No data found</p>
          </div>
        </div>
      </div>

      <!-- My Open Releases -->
      <div class="section">
        <div class="section-header">
          <h2>My Open Releases</h2>
          <button class="expand-btn">›</button>
        </div>
        <div class="content-area">
          <div *ngIf="myOpenReleases.length === 0" class="empty-state-inline">
            <span class="empty-icon-small">🔍</span>
            <p>No data found</p>
          </div>
        </div>
      </div>

      <!-- Recently Changed Projects -->
      <div class="section">
        <div class="section-header">
          <h2>Recently Changed Projects</h2>
          <button class="expand-btn">›</button>
        </div>
        <div class="projects-grid">
          <div *ngFor="let project of recentProjects" class="project-card">
            <div class="project-header">
              <h3 class="project-name">{{ project.name }}</h3>
              <span 
                class="priority-badge" 
                [ngClass]="'priority-' + project.priority">
                P{{ project.priority }}
              </span>
            </div>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-meta">
              <span class="meta-item">
                <span class="meta-icon">👥</span>
                {{ project.personCount || 0 }} people
              </span>
              <span class="meta-item">
                <span class="meta-icon">⚡</span>
                {{ project.activityCount || 0 }} activities
              </span>
            </div>
            <div class="project-footer">
              <span class="status-badge" [ngClass]="'status-' + (project.status || 'active')">
                {{ project.status || 'Active' }}
              </span>
              <button 
                class="btn-link" 
                [routerLink]="['/projects', project.id]">
                View Details →
              </button>
            </div>
          </div>

          <div *ngIf="recentProjects.length === 0" class="empty-state">
            <span class="empty-icon">📋</span>
            <p>No recently changed projects</p>
            <button class="btn-primary" [routerLink]="['/projects']">
              Browse Projects
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="section">
        <div class="section-header">
          <h2>Recent Activity</h2>
        </div>
        <div class="activity-list">
          <div *ngFor="let activity of recentActivity" class="activity-item">
            <div class="activity-icon">{{ getActivityIcon(activity.type) }}</div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-meta">
                {{ activity.user }} • {{ formatTimestamp(activity.timestamp) }}
              </div>
            </div>
          </div>

          <div *ngIf="recentActivity.length === 0" class="empty-state">
            <span class="empty-icon">📊</span>
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;
    }

    .welcome-section h1 {
      font-size: 32px;
      font-weight: 600;
      color: #212121;
      margin: 0;
    }

    /* Search Section */
    .search-section {
      margin-bottom: 32px;
    }

    .search-wrapper {
      position: relative;
      max-width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: #757575;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background: white;
    }

    .search-input:focus {
      outline: none;
      border-color: #1976d2;
    }

    /* Sections */
    .section {
      margin-bottom: 40px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 600;
      color: #212121;
      margin: 0;
    }

    .expand-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #757575;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .expand-btn:hover {
      color: #212121;
    }

    /* Content Area */
    .content-area {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state-inline {
      text-align: center;
      padding: 20px;
    }

    .empty-icon-small {
      font-size: 48px;
      display: block;
      margin-bottom: 12px;
      opacity: 0.3;
    }

    .empty-state-inline p {
      font-size: 14px;
      color: #757575;
      margin: 0;
    }

    .view-all-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: color 0.2s;
    }

    .view-all-link:hover {
      color: #1565c0;
    }

    /* Projects Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .project-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .project-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .project-name {
      font-size: 18px;
      font-weight: 600;
      color: #212121;
      margin: 0;
      flex: 1;
      margin-right: 12px;
    }

    .priority-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      color: white;
    }

    .priority-1 { background: #d32f2f; }
    .priority-2 { background: #f57c00; }
    .priority-3 { background: #fbc02d; color: #333; }
    .priority-4 { background: #7cb342; }
    .priority-5 { background: #1976d2; }

    .project-description {
      color: #616161;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .project-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #757575;
    }

    .meta-icon {
      font-size: 16px;
    }

    .project-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-active { background: #e8f5e9; color: #2e7d32; }
    .status-completed { background: #e0e0e0; color: #616161; }
    .status-on-hold { background: #fff3e0; color: #e65100; }

    .btn-link {
      background: none;
      border: none;
      color: #1976d2;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .btn-link:hover {
      background: #e3f2fd;
    }

    /* Activity List */
    .activity-list {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .activity-item {
      display: flex;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #f5f5f5;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-size: 14px;
      color: #212121;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .activity-meta {
      font-size: 12px;
      color: #757575;
    }

    /* Empty State */
    .empty-state {
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

    .empty-state p {
      font-size: 16px;
      margin: 0 0 20px 0;
    }

    .btn-primary {
      background: #1976d2;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #1565c0;
    }

    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }

      .welcome-section h1 {
        font-size: 24px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  myInitiatives: any[] = [];
  myOpenReleases: any[] = [];
  recentProjects: Project[] = [];
  recentActivity: RecentActivity[] = [];

  constructor(private plannerService: StrategicPlannerService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  onSearch() {
    // Implement search functionality
    console.log('Search query:', this.searchQuery);
  }

  loadDashboardData() {
    this.plannerService.searchProjects('', { limit: 6 }).subscribe({
      next: (projects) => {
        this.recentProjects = projects;
      },
      error: (error) => console.error('Error loading projects:', error)
    });

    // Mock recent activity (replace with real API call)
    this.recentActivity = [
      {
        type: 'project',
        title: 'New project "Mobile App Redesign" created',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: 'APEXDOTNET'
      },
      {
        type: 'activity',
        title: 'Activity "Design mockups" completed',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        user: 'APEXDOTNET'
      },
      {
        type: 'initiative',
        title: 'Initiative "Q1 2026 Goals" updated',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        user: 'APEXDOTNET'
      }
    ];
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      project: '📋',
      activity: '⚡',
      initiative: '🚀',
      area: '🎯',
      person: '👤'
    };
    return icons[type] || '📌';
  }

  formatTimestamp(timestamp: Date): string {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  }
}

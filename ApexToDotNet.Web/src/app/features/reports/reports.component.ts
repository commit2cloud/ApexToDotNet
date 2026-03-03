import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ReportLink {
  icon: string;
  title: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="apex-page">
      <div class="apex-page-title">
        <h1>Reports</h1>
      </div>

      <!-- APEX Page 41 — List region with 17 report links -->
      <div class="reports-grid">
        <a *ngFor="let report of reports"
           class="report-card"
           [routerLink]="report.route">
          <div class="report-icon">{{ report.icon }}</div>
          <div class="report-info">
            <div class="report-title">{{ report.title }}</div>
            <div class="report-description">{{ report.description }}</div>
          </div>
          <div class="report-arrow">›</div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 12px;
    }

    .report-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      padding: 16px;
      cursor: pointer;
      transition: box-shadow 0.15s;
      text-decoration: none;
      color: inherit;
    }

    .report-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .report-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #f0f4ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    .report-info {
      flex: 1;
      min-width: 0;
    }

    .report-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a73e8;
      margin-bottom: 2px;
    }

    .report-description {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .report-arrow {
      font-size: 24px;
      color: #ccc;
      flex-shrink: 0;
      font-weight: 300;
    }

    @media (max-width: 768px) {
      .reports-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportsComponent {
  // Matches APEX Page 41 list entries from APEX_APPLICATION_LIST_ENTRIES
  reports: ReportLink[] = [
    {
      icon: '📄',
      title: 'Documents',
      description: 'View all project documents and attachments',
      route: '/sp-projects'
    },
    {
      icon: '🔗',
      title: 'Links',
      description: 'View all project links and URLs',
      route: '/sp-projects'
    },
    {
      icon: '🖼️',
      title: 'Images in Comments Graph',
      description: 'Visual graph of images embedded in comments',
      route: '/sp-projects'
    },
    {
      icon: '💬',
      title: 'Comments',
      description: 'View all project comments and discussions',
      route: '/sp-projects'
    },
    {
      icon: '🏷️',
      title: 'Screen Names',
      description: 'All team member screen names and aliases',
      route: '/people'
    },
    {
      icon: '📋',
      title: 'Change History',
      description: 'Audit trail of all changes made across projects',
      route: '/sp-projects'
    },
    {
      icon: '📊',
      title: 'Projects',
      description: 'Comprehensive projects report with all fields',
      route: '/sp-projects'
    },
    {
      icon: '👥',
      title: 'Contributors',
      description: 'All project contributors and their assignments',
      route: '/people'
    },
    {
      icon: '🏁',
      title: 'Milestones / Reviews / Tasks',
      description: 'Track milestones, reviews, and tasks across projects',
      route: '/sp-projects'
    },
    {
      icon: '⏰',
      title: 'Past Due',
      description: 'Items that are past their target completion date',
      route: '/sp-projects'
    },
    {
      icon: '📅',
      title: 'Calendar',
      description: 'Calendar view of project activities and milestones',
      route: '/activities'
    },
    {
      icon: '✅',
      title: 'Approvals',
      description: 'Pending and completed approval workflows',
      route: '/sp-projects'
    },
    {
      icon: '🔄',
      title: 'Duplicates',
      description: 'Identify and manage duplicate items',
      route: '/sp-projects'
    },
    {
      icon: '📦',
      title: 'Archived',
      description: 'View all archived projects and initiatives',
      route: '/sp-projects'
    },
    {
      icon: '📅',
      title: 'Cross-Release Calendar',
      description: 'Calendar view spanning multiple releases',
      route: '/releases'
    },
    {
      icon: '🤖',
      title: 'AI Release Summaries',
      description: 'AI-generated summaries for each release',
      route: '/releases'
    },
    {
      icon: '🤖',
      title: 'AI Project Summaries',
      description: 'AI-generated summaries for each project',
      route: '/sp-projects'
    }
  ];
}

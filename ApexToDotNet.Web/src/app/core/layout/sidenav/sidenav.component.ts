import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StrategicPlannerService } from '../../../services/strategic-planner.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidenav">
      <div class="nav-items">
        <a 
          *ngFor="let item of navItems" 
          [routerLink]="item.path"
          routerLinkActive="active"
          class="nav-item">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span *ngIf="item.badge" class="nav-badge">{{ item.badge }}</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .sidenav {
      width: 240px;
      background: white;
      border-right: 1px solid #e0e0e0;
      overflow-y: auto;
      flex-shrink: 0;
    }

    .nav-items {
      padding: 8px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: #424242;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      gap: 12px;
    }

    .nav-item:hover {
      background: #f5f5f5;
      color: #1976d2;
    }

    .nav-item.active {
      background: #e3f2fd;
      color: #1976d2;
      border-left: 3px solid #1976d2;
      padding-left: 13px;
    }

    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }

    .nav-label {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }

    .nav-badge {
      background: #1976d2;
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      min-width: 20px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .sidenav {
        position: fixed;
        left: 0;
        top: 56px;
        height: calc(100vh - 56px);
        z-index: 999;
        box-shadow: 2px 0 8px rgba(0,0,0,0.1);
      }

      .sidenav.mobile-hidden {
        transform: translateX(-100%);
      }
    }
  `]
})
export class SidenavComponent implements OnInit {
  navItems: NavItem[] = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/areas', label: 'Areas', icon: '🎯', badge: 0 },
    { path: '/initiatives', label: 'Initiatives', icon: '🚀', badge: 0 },
    { path: '/projects', label: 'Projects', icon: '�', badge: 0 },
    { path: '/project-groups', label: 'Project Groups', icon: '📁', badge: 0 },
    { path: '/activities', label: 'Activities', icon: '⚡', badge: 0 },
    { path: '/releases', label: 'Releases', icon: '🎉', badge: 0 },
    { path: '/people', label: 'People', icon: '�', badge: 0 },
    { path: '/person-groups', label: 'Person Groups', icon: '👨‍👩‍👧‍👦', badge: 0 },
    { path: '/reports', label: 'Reports', icon: '📊' }
  ];

  constructor(
    private router: Router,
    private plannerService: StrategicPlannerService
  ) {}

  ngOnInit() {
    this.loadNavigationCounts();
  }

  loadNavigationCounts() {
    this.plannerService.getNavigationCounts().subscribe({
      next: (counts) => {
        this.updateBadges(counts);
      },
      error: (error) => {
        console.error('Error loading navigation counts:', error);
      }
    });
  }

  private updateBadges(counts: any) {
    const badgeMap: { [key: string]: string } = {
      '/projects': 'projects',
      '/areas': 'areas',
      '/initiatives': 'initiatives',
      '/activities': 'activities',
      '/people': 'people',
      '/project-groups': 'projectGroups',
      '/person-groups': 'personGroups',
      '/releases': 'releases'
    };

    this.navItems.forEach(item => {
      const countKey = badgeMap[item.path];
      if (countKey && counts[countKey] !== undefined) {
        item.badge = counts[countKey];
      }
    });
  }
}

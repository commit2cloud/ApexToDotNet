import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StrategicPlannerService } from './services/strategic-planner.service';
import { NavigationCounts } from './models/strategic-planner.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- APEX-style app shell: side nav + top bar + content -->
    <div class="apex-app" [class.nav-collapsed]="navCollapsed">
      <!-- Side Navigation (matches APEX Navigation Menu) -->
      <nav class="apex-side-nav">
        <div class="nav-header">
          <span class="app-icon">📋</span>
          <span class="app-name" *ngIf="!navCollapsed">Strategic Planner</span>
        </div>
        <ul class="nav-list">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <span class="nav-icon">🏠</span>
              <span class="nav-label" *ngIf="!navCollapsed">Home</span>
            </a>
          </li>
          <li>
            <a routerLink="/areas" routerLinkActive="active">
              <span class="nav-icon">📁</span>
              <span class="nav-label" *ngIf="!navCollapsed">Areas</span>
              <span class="nav-badge" *ngIf="!navCollapsed && counts.areas">{{ counts.areas }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/initiatives" routerLinkActive="active">
              <span class="nav-icon">💡</span>
              <span class="nav-label" *ngIf="!navCollapsed">Initiatives</span>
              <span class="nav-badge" *ngIf="!navCollapsed && counts.initiatives">{{ counts.initiatives }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/sp-projects" routerLinkActive="active">
              <span class="nav-icon">📦</span>
              <span class="nav-label" *ngIf="!navCollapsed">Projects</span>
              <span class="nav-badge" *ngIf="!navCollapsed && counts.projects">{{ counts.projects }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/project-groups" routerLinkActive="active">
              <span class="nav-icon">📦</span>
              <span class="nav-label" *ngIf="!navCollapsed">Project Groups</span>
              <span class="nav-badge" *ngIf="!navCollapsed && counts.projectGroups">{{ counts.projectGroups }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/activities" routerLinkActive="active">
              <span class="nav-icon">✅</span>
              <span class="nav-label" *ngIf="!navCollapsed">Activities</span>
              <span class="nav-badge" *ngIf="!navCollapsed && counts.activities">{{ counts.activities }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/releases" routerLinkActive="active">
              <span class="nav-icon">🚢</span>
              <span class="nav-label" *ngIf="!navCollapsed">Releases</span>
              <span class="nav-badge" *ngIf="!navCollapsed && counts.releases">{{ counts.releases }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/people" routerLinkActive="active">
              <span class="nav-icon">👤</span>
              <span class="nav-label" *ngIf="!navCollapsed">People</span>
              <span class="nav-badge" *ngIf="!navCollapsed && counts.people">{{ counts.people }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/people-groups" routerLinkActive="active">
              <span class="nav-icon">👥</span>
              <span class="nav-label" *ngIf="!navCollapsed">People Groups</span>
              <span class="nav-badge" *ngIf="!navCollapsed && counts.peopleGroups">{{ counts.peopleGroups }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/reports" routerLinkActive="active">
              <span class="nav-icon">📊</span>
              <span class="nav-label" *ngIf="!navCollapsed">Reports</span>
            </a>
          </li>
        </ul>
        <button class="nav-toggle" (click)="navCollapsed = !navCollapsed">
          {{ navCollapsed ? '▶' : '◀' }}
        </button>
      </nav>

      <!-- Main content area -->
      <div class="apex-main">
        <!-- Top bar (matches APEX Navigation Bar) -->
        <header class="apex-top-bar">
          <div class="top-bar-left">
            <button class="menu-toggle" (click)="navCollapsed = !navCollapsed">☰</button>
          </div>
          <div class="top-bar-right">
            <a routerLink="/sp-projects" class="top-bar-link">My Projects</a>
            <a routerLink="/activities" class="top-bar-link">My Activities</a>
            <span class="top-bar-divider">|</span>
            <span class="user-icon">👤</span>
            <span class="user-name">John Doe</span>
          </div>
        </header>

        <!-- Page content -->
        <main class="apex-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* ========================================
       APEX Universal Theme - Faithful Recreation
       Based on Oracle APEX 24.2 "Redwood Light"
       ======================================== */

    :host {
      display: block;
      height: 100vh;
    }

    .apex-app {
      display: flex;
      height: 100vh;
      background: #f5f5f5;
    }

    /* Side Navigation */
    .apex-side-nav {
      width: 240px;
      background: #1b2636;
      color: #d4d8dd;
      display: flex;
      flex-direction: column;
      transition: width 0.2s ease;
      flex-shrink: 0;
      z-index: 100;
    }

    .nav-collapsed .apex-side-nav {
      width: 52px;
    }

    .nav-header {
      display: flex;
      align-items: center;
      padding: 16px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      gap: 10px;
      min-height: 56px;
    }

    .app-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .app-name {
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
      color: #fff;
    }

    .nav-list {
      list-style: none;
      padding: 8px 0;
      margin: 0;
      flex: 1;
      overflow-y: auto;
    }

    .nav-list li a {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      color: #b8bfc7;
      text-decoration: none;
      font-size: 13px;
      gap: 12px;
      transition: background 0.15s, color 0.15s;
      border-left: 3px solid transparent;
    }

    .nav-list li a:hover {
      background: rgba(255,255,255,0.08);
      color: #fff;
    }

    .nav-list li a.active {
      background: rgba(255,255,255,0.12);
      color: #fff;
      border-left-color: #4ba0f5;
    }

    .nav-icon {
      font-size: 16px;
      width: 20px;
      text-align: center;
      flex-shrink: 0;
    }

    .nav-label {
      white-space: nowrap;
      flex: 1;
    }

    .nav-badge {
      background: rgba(255,255,255,0.15);
      color: #b8bfc7;
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
      flex-shrink: 0;
    }

    .nav-list li a.active .nav-badge {
      background: rgba(75,160,245,0.25);
      color: #fff;
    }

    .nav-toggle {
      border: none;
      background: rgba(255,255,255,0.05);
      color: #8a929b;
      padding: 10px;
      cursor: pointer;
      font-size: 12px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .nav-toggle:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }

    /* Main area */
    .apex-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Top bar */
    .apex-top-bar {
      height: 48px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      flex-shrink: 0;
    }

    .menu-toggle {
      border: none;
      background: none;
      font-size: 18px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      color: #555;
    }

    .menu-toggle:hover {
      background: #f0f0f0;
    }

    .top-bar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .top-bar-link {
      color: #4a6785;
      text-decoration: none;
      font-weight: 500;
    }

    .top-bar-link:hover {
      color: #1a73e8;
    }

    .top-bar-divider {
      color: #ddd;
    }

    .user-icon {
      font-size: 16px;
    }

    .user-name {
      color: #333;
      font-weight: 500;
    }

    /* Content area */
    .apex-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }
  `],
})
export class AppComponent implements OnInit {
  title = 'Strategic Planner';
  navCollapsed = false;
  counts: NavigationCounts = {
    projects: 0, areas: 0, initiatives: 0, activities: 0,
    people: 0, releases: 0, projectGroups: 0, peopleGroups: 0
  };

  constructor(private spService: StrategicPlannerService) {}

  ngOnInit(): void {
    this.spService.getNavigationCounts().subscribe({
      next: (c) => this.counts = c
    });
  }
}

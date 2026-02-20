import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <button class="menu-toggle" (click)="toggleSidenav()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <h1 class="app-title">Our Strategic Planner</h1>
      </div>
      <div class="header-right">
        <span class="username">APEXDOTNET</span>
        <div class="user-menu">
          <button class="user-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 56px;
      background: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-toggle {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .menu-toggle:hover {
      background: rgba(255,255,255,0.1);
    }

    .app-title {
      font-size: 20px;
      font-weight: 500;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .username {
      font-size: 14px;
      font-weight: 500;
    }

    .user-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .user-button:hover {
      background: rgba(255,255,255,0.1);
    }

    @media (max-width: 768px) {
      .app-title {
        font-size: 16px;
      }
      .username {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  toggleSidenav() {
    // Will emit event to toggle sidenav
    document.querySelector('.sidenav')?.classList.toggle('mobile-hidden');
  }
}

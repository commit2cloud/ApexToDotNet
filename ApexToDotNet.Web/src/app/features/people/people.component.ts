import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>People</h1>
        <p class="page-subtitle">Team members and contributors</p>
      </div>
      <div class="coming-soon">
        <span class="icon">👥</span>
        <h2>People Directory</h2>
        <p>List of all team members with contribution stats</p>
        <p class="note">Follow the pattern in areas.component.ts to build this</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    .page-header h1 { font-size: 32px; font-weight: 600; color: #212121; margin: 0 0 8px 0; }
    .page-subtitle { font-size: 16px; color: #757575; margin: 0; }
    .coming-soon { text-align: center; padding: 80px 20px; background: white; border-radius: 12px; margin-top: 32px; }
    .coming-soon .icon { font-size: 80px; display: block; margin-bottom: 24px; opacity: 0.6; }
    .coming-soon h2 { font-size: 28px; color: #212121; margin: 0 0 12px 0; }
    .coming-soon p { color: #757575; margin: 8px 0; }
    .coming-soon .note { font-size: 14px; color: #1976d2; margin-top: 24px; }
  `]
})
export class PeopleComponent {}

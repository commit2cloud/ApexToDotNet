import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="t-Region">
      <div class="t-Region-header"><h2>Calendar View</h2></div>
      <div class="t-Region-body">
        <p>Legacy calendar view — replaced by Strategic Planner pages.</p>
        <a routerLink="/sp-projects">Go to Projects</a>
      </div>
    </div>
  `,
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent {}

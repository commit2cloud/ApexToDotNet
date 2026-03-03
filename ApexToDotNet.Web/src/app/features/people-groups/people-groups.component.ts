import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { PeopleGroup } from '../../models/strategic-planner.models';

@Component({
  selector: 'app-people-groups',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="apex-page">
      <div class="apex-page-title">
        <h1>People Groups</h1>
      </div>

      <div *ngIf="loading" class="apex-loading">Loading people groups...</div>

      <div *ngIf="!loading" class="t-Region">
        <div class="t-Region-header"><h2>All People Groups</h2></div>
        <div class="t-Region-body">
          <table class="t-Report-report" *ngIf="groups.length > 0">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Description</th>
                <th>Tag</th>
                <th class="text-center">Members</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let g of groups">
                <td>
                  <strong>{{ g.groupName }}</strong>
                </td>
                <td>{{ g.groupDescription || '—' }}</td>
                <td>
                  <span *ngIf="g.groupTag" class="apex-tag">{{ g.groupTag }}</span>
                  <span *ngIf="!g.groupTag">—</span>
                </td>
                <td class="text-center">
                  <span class="apex-badge">{{ g.members || 0 }}</span>
                </td>
                <td>{{ g.updated | date:'mediumDate' }}</td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="groups.length === 0" class="apex-empty-state">
            <p>No people groups defined yet.</p>
            <p style="color: #666; font-size: 0.9em;">
              People groups let you organize team members into functional teams and committees.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-center { text-align: center; }
    .apex-tag {
      display: inline-block;
      padding: 2px 8px;
      background: #e8eaf6;
      color: #3f51b5;
      border-radius: 4px;
      font-size: 0.85em;
    }
  `]
})
export class PeopleGroupsComponent implements OnInit {
  groups: PeopleGroup[] = [];
  loading = true;

  constructor(private spService: StrategicPlannerService) {}

  ngOnInit(): void {
    this.spService.getPeopleGroups().subscribe({
      next: (data) => { this.groups = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}

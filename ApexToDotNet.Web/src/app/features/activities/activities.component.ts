import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Activity {
  id: number;
  title: string;
  owner: string;
  developmentStart?: string;
  developmentEnd?: string;
  reviewStart?: string;
  reviewEnd?: string;
  project: string;
  status: 'Past' | 'Active' | 'Future';
  type: 'Development' | 'Review';
  initiative?: string;
  release?: string;
  teamMemberTags?: string[];
  projectRelated: boolean;
}

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  searchQuery = '';
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];

  // Filter states
  filters = {
    projectRelated: { yes: false },
    timeframe: { past: false },
    owner: { johnDoe: false, janeDoe: false },
    initiative: {},
    release: { alphaR110: false },
    teamMemberTags: {},
    type: { development: false, review: false },
    myActivity: { no: false }
  };

  ngOnInit() {
    this.loadActivities();
    this.applyFilters();
  }

  loadActivities() {
    // Mock data matching the screenshot
    this.activities = [
      {
        id: 1,
        title: 'Active development',
        owner: 'John Doe',
        developmentStart: 'Wednesday, 07-JAN-2026',
        developmentEnd: 'Sunday 08-FEB-2026',
        project: 'Project 1',
        status: 'Past',
        type: 'Development',
        projectRelated: true
      },
      {
        id: 2,
        title: 'Demo prep',
        owner: 'John Doe',
        developmentStart: 'Friday, 06-FEB-2026',
        developmentEnd: 'Sunday 08-FEB-2026',
        project: 'Project 1',
        status: 'Past',
        type: 'Development',
        projectRelated: true
      },
      {
        id: 3,
        title: 'Review',
        owner: 'Jane Doe',
        reviewStart: 'Tuesday, 10-FEB-2026',
        reviewEnd: 'Tuesday 10-FEB-2026',
        project: 'Project 1',
        status: 'Past',
        type: 'Review',
        projectRelated: true
      }
    ];
  }

  applyFilters() {
    this.filteredActivities = this.activities.filter(activity => {
      // Apply search
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        if (!activity.title.toLowerCase().includes(query) &&
            !activity.owner.toLowerCase().includes(query) &&
            !activity.project.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Apply other filters as needed
      return true;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  getStatusBadgeClass(status: string): string {
    return `status-badge status-${status.toLowerCase()}`;
  }

  formatDateRange(start: string, end?: string): string {
    if (end && start !== end) {
      return `${start} to ${end}`;
    }
    return start;
  }
}

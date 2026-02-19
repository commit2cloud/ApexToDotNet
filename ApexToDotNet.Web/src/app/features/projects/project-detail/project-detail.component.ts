import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { StrategicPlannerService } from '../../../services/strategic-planner.service';
import { Project, Priority } from '../../../models/project';

interface Comment {
  id: number;
  author: string;
  authorInitials: string;
  content: string;
  isPrivate: boolean;
  createdDate: Date;
  createdBy: string;
}

interface Activity {
  id: number;
  action: string;
  author: string;
  timestamp: Date;
  details?: string;
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isLoading = true;
  activeTab = 'comments';
  
  // Mock data for tabs
  comments: Comment[] = [
    {
      id: 1,
      author: 'John Doe',
      authorInitials: 'JD',
      content: 'This is a private comment',
      isPrivate: true,
      createdDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
      createdBy: 'John Doe'
    }
  ];
  
  activities: Activity[] = [
    {
      id: 1,
      action: 'Updated status',
      author: 'admin',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      details: 'Changed status to "In Review"'
    },
    {
      id: 2,
      action: 'Updated priority',
      author: 'admin',
      timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
      details: 'Changed priority from P3 to P2'
    }
  ];
  
  newComment = '';
  isPrivateComment = false;
  isFavorite = false;
  
  // Metadata
  projectMetadata = {
    area: 'Alpha',
    group: '',
    created: '8h',
    createdBy: 'admin',
    updated: '8h',
    updatedBy: 'admin',
    changes: 12,
    interactions: 3,
    interactionUsers: 1,
    patroned: 0
  };

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private plannerService: StrategicPlannerService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadProject(id);
      }
    });
  }

  loadProject(id: number): void {
    this.projectService.getProject(id).subscribe({
      next: (data) => {
        this.project = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching project', err);
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    // TODO: Call API to update favorite status
  }

  addComment(): void {
    if (this.newComment.trim()) {
      const comment: Comment = {
        id: this.comments.length + 1,
        author: 'Current User',
        authorInitials: 'CU',
        content: this.newComment,
        isPrivate: this.isPrivateComment,
        createdDate: new Date(),
        createdBy: 'Current User'
      };
      this.comments.push(comment);
      this.newComment = '';
      this.isPrivateComment = false;
    }
  }

  getPriorityLabel(priority: Priority): string {
    return `P${priority}`;
  }

  getPriorityClass(priority: Priority): string {
    return `priority-${priority}`;
  }

  getTimeSince(date: Date | undefined): string {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  getCompletionPercentage(): number {
    // TODO: Calculate from actual data
    return 70;
  }

  getCompletionStatus(): string {
    return 'In Review';
  }
}

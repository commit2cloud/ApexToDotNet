import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StrategicPlannerService } from '../../../services/strategic-planner.service';
import { Project, ProjectStatus, ProjectPriority, Initiative, Area, Release, TeamMember } from '../../../models/strategic-planner.models';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading = true;

  // Faceted search filters
  searchQuery = '';
  statuses: ProjectStatus[] = [];
  priorities: ProjectPriority[] = [];
  initiatives: Initiative[] = [];
  areas: Area[] = [];
  releases: Release[] = [];
  teamMembers: TeamMember[] = [];

  // Derived facets from data
  uniqueOwners: { name: string; count: number }[] = [];
  uniqueTags: { tag: string; count: number }[] = [];

  // Active filter selections
  selectedStatuses: Set<string> = new Set();
  selectedPriorities: Set<number> = new Set();
  selectedInitiative: string | null = null;
  selectedArea: string | null = null;
  selectedRelease: string | null = null;
  selectedOwners: Set<string> = new Set();
  selectedTags: Set<string> = new Set();

  constructor(private plannerService: StrategicPlannerService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.plannerService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data;
        this.isLoading = false;
        this.buildDerivedFacets();
      },
      error: (err) => {
        console.error('Error fetching projects', err);
        this.isLoading = false;
      }
    });

    this.plannerService.getStatuses().subscribe(s => this.statuses = s);
    this.plannerService.getPriorities().subscribe(p => this.priorities = p);
    this.plannerService.getInitiatives().subscribe(i => this.initiatives = i);
    this.plannerService.getAreas().subscribe(a => this.areas = a);
    this.plannerService.getReleases().subscribe(r => this.releases = r);
    this.plannerService.getTeamMembers().subscribe(t => this.teamMembers = t);
  }

  buildDerivedFacets(): void {
    // Build owner counts from project data
    const ownerMap = new Map<string, number>();
    this.projects.forEach(p => {
      const owner = p.owner || '(No Owner)';
      ownerMap.set(owner, (ownerMap.get(owner) || 0) + 1);
    });
    this.uniqueOwners = Array.from(ownerMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Build tag counts
    const tagMap = new Map<string, number>();
    this.projects.forEach(p => {
      if (p.tags) {
        p.tags.split(',').map(t => t.trim()).filter(t => t).forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      }
    });
    this.uniqueTags = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  applyFilters(): void {
    let result = this.projects;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.projectName.toLowerCase().includes(q) ||
        (p.owner && p.owner.toLowerCase().includes(q)) ||
        (p.initiative && p.initiative.toLowerCase().includes(q)) ||
        (p.area && p.area.toLowerCase().includes(q))
      );
    }

    if (this.selectedArea) {
      result = result.filter(p => p.area === this.selectedArea);
    }

    if (this.selectedInitiative) {
      result = result.filter(p => p.initiative === this.selectedInitiative);
    }

    if (this.selectedRelease) {
      result = result.filter(p => p.release === this.selectedRelease);
    }

    if (this.selectedOwners.size > 0) {
      result = result.filter(p => p.owner && this.selectedOwners.has(p.owner));
    }

    if (this.selectedTags.size > 0) {
      result = result.filter(p => {
        if (!p.tags) return false;
        const projectTags = p.tags.split(',').map(t => t.trim());
        return Array.from(this.selectedTags).some(t => projectTags.includes(t));
      });
    }

    if (this.selectedPriorities.size > 0) {
      result = result.filter(p => p.priorityId != null && this.selectedPriorities.has(p.priorityId));
    }

    if (this.selectedStatuses.size > 0) {
      result = result.filter(p => p.status && this.selectedStatuses.has(p.status));
    }

    this.filteredProjects = result;
  }

  toggleStatus(status: string): void {
    if (this.selectedStatuses.has(status)) {
      this.selectedStatuses.delete(status);
    } else {
      this.selectedStatuses.add(status);
    }
    this.applyFilters();
  }

  togglePriority(id: number): void {
    if (this.selectedPriorities.has(id)) {
      this.selectedPriorities.delete(id);
    } else {
      this.selectedPriorities.add(id);
    }
    this.applyFilters();
  }

  toggleOwner(name: string): void {
    if (this.selectedOwners.has(name)) {
      this.selectedOwners.delete(name);
    } else {
      this.selectedOwners.add(name);
    }
    this.applyFilters();
  }

  toggleTag(tag: string): void {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedStatuses.size || this.selectedPriorities.size ||
      this.selectedInitiative || this.selectedArea || this.selectedRelease ||
      this.selectedOwners.size || this.selectedTags.size);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatuses.clear();
    this.selectedPriorities.clear();
    this.selectedInitiative = null;
    this.selectedArea = null;
    this.selectedRelease = null;
    this.selectedOwners.clear();
    this.selectedTags.clear();
    this.filteredProjects = this.projects;
  }

  getPctClass(pct: number | undefined): string {
    if (!pct || pct === 0) return 'pct-low';
    if (pct < 50) return 'pct-low';
    if (pct < 80) return 'pct-mid';
    if (pct < 100) return 'pct-high';
    return 'pct-done';
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.plannerService.deleteProject(id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== id);
          this.applyFilters();
        },
        error: (err) => console.error('Error deleting project', err)
      });
    }
  }
}

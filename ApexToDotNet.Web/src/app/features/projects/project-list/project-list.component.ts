import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { Project, Priority, Area, Initiative } from '../../../models/project';
import { RouterLink } from '@angular/router';
import { StrategicPlannerService } from '../../../services/strategic-planner.service';

interface FilterState {
  searchQuery: string;
  selectedAreas: number[];
  selectedInitiatives: number[];
  selectedReleases: string[];
  selectedOwners: string[];
  selectedTags: string[];
  selectedPriorities: Priority[];
  selectedStatuses: string[];
  showFavoritesOnly: boolean;
  sortBy: string;
}

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
  
  // Filter options
  areas: Area[] = [];
  initiatives: Initiative[] = [];
  releases: string[] = [];
  owners: string[] = [];
  tags: string[] = [];
  priorities = [Priority.P1, Priority.P2, Priority.P3, Priority.P4, Priority.P5];
  statuses = ['Not Set', 'NA', 'Active', 'On Hold', 'Completed'];
  
  // Filter state
  filters: FilterState = {
    searchQuery: '',
    selectedAreas: [],
    selectedInitiatives: [],
    selectedReleases: [],
    selectedOwners: [],
    selectedTags: [],
    selectedPriorities: [],
    selectedStatuses: [],
    showFavoritesOnly: false,
    sortBy: 'updatedDesc'
  };
  
  // Sidebar collapse state
  collapsedSections = {
    area: false,
    initiative: false,
    release: false,
    owner: false,
    tags: false,
    priority: false,
    status: false,
    projectGroup: false
  };

  constructor(
    private projectService: ProjectService,
    private plannerService: StrategicPlannerService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.loadFilterOptions();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching projects', err);
        this.isLoading = false;
      }
    });
  }
  
  loadFilterOptions(): void {
    // Load areas
    this.plannerService.getAreas().subscribe({
      next: (data) => this.areas = data,
      error: (err) => console.error('Error loading areas', err)
    });
    
    // Load initiatives
    this.plannerService.getInitiatives().subscribe({
      next: (data) => this.initiatives = data,
      error: (err) => console.error('Error loading initiatives', err)
    });
    
    // Extract unique owners and tags from projects when loaded
    // These would ideally come from the API
  }

  applyFilters(): void {
    let filtered = [...this.projects];
    
    // Search filter
    if (this.filters.searchQuery) {
      const query = this.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query)
      );
    }
    
    // Area filter
    if (this.filters.selectedAreas.length > 0) {
      filtered = filtered.filter(p => 
        p.areaId && this.filters.selectedAreas.includes(p.areaId)
      );
    }
    
    // Initiative filter
    if (this.filters.selectedInitiatives.length > 0) {
      filtered = filtered.filter(p => 
        p.initiativeId && this.filters.selectedInitiatives.includes(p.initiativeId)
      );
    }
    
    // Priority filter
    if (this.filters.selectedPriorities.length > 0) {
      filtered = filtered.filter(p => 
        this.filters.selectedPriorities.includes(p.priority)
      );
    }
    
    // Status filter
    if (this.filters.selectedStatuses.length > 0) {
      filtered = filtered.filter(p => 
        p.status && this.filters.selectedStatuses.includes(p.status)
      );
    }
    
    // Sort
    filtered = this.sortProjects(filtered, this.filters.sortBy);
    
    this.filteredProjects = filtered;
  }
  
  sortProjects(projects: Project[], sortBy: string): Project[] {
    const sorted = [...projects];
    
    switch (sortBy) {
      case 'updatedDesc':
        return sorted.sort((a, b) => 
          (b.updatedDate?.getTime() || 0) - (a.updatedDate?.getTime() || 0)
        );
      case 'updatedAsc':
        return sorted.sort((a, b) => 
          (a.updatedDate?.getTime() || 0) - (b.updatedDate?.getTime() || 0)
        );
      case 'nameAsc':
        return sorted.sort((a, b) => 
          (a.name || '').localeCompare(b.name || '')
        );
      case 'nameDesc':
        return sorted.sort((a, b) => 
          (b.name || '').localeCompare(a.name || '')
        );
      case 'priorityAsc':
        return sorted.sort((a, b) => a.priority - b.priority);
      case 'priorityDesc':
        return sorted.sort((a, b) => b.priority - a.priority);
      default:
        return sorted;
    }
  }
  
  toggleFilter(filterType: 'area' | 'initiative' | 'priority' | 'status', value: any): void {
    let filterArray: any[];
    
    switch (filterType) {
      case 'area':
        filterArray = this.filters.selectedAreas;
        break;
      case 'initiative':
        filterArray = this.filters.selectedInitiatives;
        break;
      case 'priority':
        filterArray = this.filters.selectedPriorities;
        break;
      case 'status':
        filterArray = this.filters.selectedStatuses;
        break;
    }
    
    const index = filterArray.indexOf(value);
    if (index > -1) {
      filterArray.splice(index, 1);
    } else {
      filterArray.push(value);
    }
    
    this.applyFilters();
  }
  
  isFilterSelected(filterType: 'area' | 'initiative' | 'priority' | 'status', value: any): boolean {
    switch (filterType) {
      case 'area':
        return this.filters.selectedAreas.includes(value);
      case 'initiative':
        return this.filters.selectedInitiatives.includes(value);
      case 'priority':
        return this.filters.selectedPriorities.includes(value);
      case 'status':
        return this.filters.selectedStatuses.includes(value);
      default:
        return false;
    }
  }
  
  toggleSection(section: keyof typeof this.collapsedSections): void {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }
  
  clearAllFilters(): void {
    this.filters = {
      searchQuery: '',
      selectedAreas: [],
      selectedInitiatives: [],
      selectedReleases: [],
      selectedOwners: [],
      selectedTags: [],
      selectedPriorities: [],
      selectedStatuses: [],
      showFavoritesOnly: false,
      sortBy: 'updatedDesc'
    };
    this.applyFilters();
  }
  
  getFilterCount(): number {
    return this.filters.selectedAreas.length +
           this.filters.selectedInitiatives.length +
           this.filters.selectedPriorities.length +
           this.filters.selectedStatuses.length;
  }
  
  getPriorityLabel(priority: Priority): string {
    return `P${priority}`;
  }
  
  getTimeSince(date?: Date): string {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== id);
          this.applyFilters();
        },
        error: (err) => console.error('Error deleting project', err)
      });
    }
  }
}

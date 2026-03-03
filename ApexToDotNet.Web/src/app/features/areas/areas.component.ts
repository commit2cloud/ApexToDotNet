import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { Area } from '../../models/strategic-planner.models';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="apex-page">
      <div class="apex-page-title">
        <h1>Areas</h1>
      </div>

      <div *ngIf="loading" class="apex-loading">Loading areas...</div>

      <div *ngIf="!loading" class="apex-faceted-layout">
        <!-- Left Column: Faceted Search (APEX Page 17 Faceted Search region) -->
        <div class="apex-facet-panel">
          <div class="facet-search">
            <input
              type="text"
              class="facet-search-input"
              placeholder="Search..."
              [(ngModel)]="searchQuery"
              (input)="applyFilters()">
          </div>

          <!-- Owner facet -->
          <div class="facet-group" *ngIf="uniqueOwners.length > 0">
            <div class="apex-facet-title">▸ Owner</div>
            <label *ngFor="let o of uniqueOwners" class="facet-option">
              <input type="checkbox" [checked]="selectedOwners.has(o.name)" (change)="toggleOwner(o.name)">
              <span>{{ o.name }} ({{ o.count }})</span>
            </label>
          </div>

          <!-- Tags facet -->
          <div class="facet-group" *ngIf="uniqueTags.length > 0">
            <div class="apex-facet-title">▸ Tags</div>
            <label *ngFor="let t of uniqueTags" class="facet-option">
              <input type="checkbox" [checked]="selectedTags.has(t.tag)" (change)="toggleTag(t.tag)">
              <span>{{ t.tag }} ({{ t.count }})</span>
            </label>
          </div>

          <!-- Updated Month facet -->
          <div class="facet-group" *ngIf="updatedMonths.length > 0">
            <div class="apex-facet-title">▸ Updated Month</div>
            <label *ngFor="let m of updatedMonths" class="facet-option">
              <input type="checkbox" [checked]="selectedUpdatedMonths.has(m.month)" (change)="toggleUpdatedMonth(m.month)">
              <span>{{ m.month }} ({{ m.count }})</span>
            </label>
          </div>

          <!-- Created Month facet -->
          <div class="facet-group" *ngIf="createdMonths.length > 0">
            <div class="apex-facet-title">▸ Created Month</div>
            <label *ngFor="let m of createdMonths" class="facet-option">
              <input type="checkbox" [checked]="selectedCreatedMonths.has(m.month)" (change)="toggleCreatedMonth(m.month)">
              <span>{{ m.month }} ({{ m.count }})</span>
            </label>
          </div>

          <!-- Last Created Project facet -->
          <div class="facet-group" *ngIf="lastCreatedProjectOptions.length > 0">
            <div class="apex-facet-title">▸ Last Created Project</div>
            <label *ngFor="let p of lastCreatedProjectOptions" class="facet-option">
              <input type="checkbox" [checked]="selectedLastCreatedProject.has(p.label)" (change)="toggleLastCreatedProject(p.label)">
              <span>{{ p.label }} ({{ p.count }})</span>
            </label>
          </div>

          <!-- Default Display facet -->
          <div class="facet-group">
            <div class="apex-facet-title">▸ Default Display</div>
            <label class="facet-option">
              <input type="radio" name="defaultDisplay"
                [checked]="defaultDisplay === 'Y'"
                (change)="defaultDisplay = 'Y'; applyFilters()">
              <span>Yes</span>
            </label>
            <label class="facet-option">
              <input type="radio" name="defaultDisplay"
                [checked]="defaultDisplay === 'N'"
                (change)="defaultDisplay = 'N'; applyFilters()">
              <span>No</span>
            </label>
            <label class="facet-option" *ngIf="defaultDisplay">
              <input type="radio" name="defaultDisplay" (change)="defaultDisplay = null; applyFilters()">
              <span class="clear-filter">Clear</span>
            </label>
          </div>

          <button *ngIf="hasActiveFilters"
            class="apex-btn apex-btn-secondary apex-btn-sm clear-all-btn"
            (click)="clearFilters()">
            Clear All Filters
          </button>
        </div>

        <!-- Body: Area Cards -->
        <div class="areas-body">
          <div class="results-count" *ngIf="filteredAreas.length > 0">
            {{ filteredAreas.length }} area{{ filteredAreas.length !== 1 ? 's' : '' }}
          </div>

          <div class="areas-grid">
            <div *ngFor="let area of filteredAreas" class="area-card" [routerLink]="['/sp-projects']" [queryParams]="{areaId: area.id}">
              <div class="area-header">
                <div class="area-color" [style.background]="area.color || '#1976d2'"></div>
                <h3 class="area-name">{{ area.areaName }}</h3>
              </div>
              <p class="area-description">{{ area.description || 'No description' }}</p>
              <div class="area-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ area.projects || 0 }}</span>
                  <span class="stat-label">Projects</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ area.initiatives || 0 }}</span>
                  <span class="stat-label">Initiatives</span>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="filteredAreas.length === 0" class="apex-empty-state">
            No areas match your criteria.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .facet-search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .facet-search-input:focus {
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
      outline: none;
    }
    .facet-group {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    .facet-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      font-size: 13px;
      color: #333;
      cursor: pointer;
    }
    .facet-option input[type="checkbox"],
    .facet-option input[type="radio"] {
      width: auto;
      margin: 0;
    }
    .clear-filter {
      color: #1a73e8;
      font-size: 12px;
    }
    .clear-all-btn {
      width: 100%;
      margin-top: 8px;
    }
    .results-count {
      font-size: 13px;
      color: #888;
      margin-bottom: 12px;
    }

    .areas-body {
      min-height: 200px;
    }

    .areas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .area-card {
      background: white;
      border-radius: 4px;
      padding: 16px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      transition: box-shadow 0.15s;
      cursor: pointer;
    }

    .area-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .area-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .area-color {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .area-name {
      font-size: 15px;
      font-weight: 600;
      color: #1a73e8;
      margin: 0;
      flex: 1;
    }

    .area-description {
      color: #555;
      font-size: 13px;
      line-height: 1.5;
      margin: 0 0 12px 0;
      min-height: 38px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .area-stats {
      display: flex;
      gap: 20px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #1a73e8;
    }

    .stat-label {
      font-size: 11px;
      color: #888;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    @media (max-width: 768px) {
      .areas-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AreasComponent implements OnInit {
  areas: Area[] = [];
  filteredAreas: Area[] = [];
  loading = false;
  searchQuery = '';

  // Facet data
  uniqueOwners: { name: string; count: number }[] = [];
  uniqueTags: { tag: string; count: number }[] = [];
  updatedMonths: { month: string; count: number }[] = [];
  createdMonths: { month: string; count: number }[] = [];
  lastCreatedProjectOptions: { label: string; count: number }[] = [];

  // Facet selections
  selectedOwners = new Set<string>();
  selectedTags = new Set<string>();
  selectedUpdatedMonths = new Set<string>();
  selectedCreatedMonths = new Set<string>();
  selectedLastCreatedProject = new Set<string>();
  defaultDisplay: string | null = null;

  constructor(private plannerService: StrategicPlannerService) {}

  ngOnInit() {
    this.loadAreas();
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery.length > 0
      || this.selectedOwners.size > 0
      || this.selectedTags.size > 0
      || this.selectedUpdatedMonths.size > 0
      || this.selectedCreatedMonths.size > 0
      || this.selectedLastCreatedProject.size > 0
      || this.defaultDisplay !== null;
  }

  loadAreas() {
    this.loading = true;
    this.plannerService.getAreas().subscribe({
      next: (data) => {
        this.areas = data;
        this.buildFacets();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading areas:', error);
        this.loading = false;
      }
    });
  }

  buildFacets() {
    // Owner facet — derive from description or placeholder since Area model doesn't have owner
    // For now, just build with what we have
    const ownerMap = new Map<string, number>();
    this.areas.forEach(a => {
      const owner = 'Admin'; // Default — will be data-driven when API provides owner
      ownerMap.set(owner, (ownerMap.get(owner) || 0) + 1);
    });
    this.uniqueOwners = Array.from(ownerMap, ([name, count]) => ({ name, count }));

    // Tags — derive from area data if available
    const tagMap = new Map<string, number>();
    // Areas don't have tags yet, but show the facet section anyway (empty)
    this.uniqueTags = Array.from(tagMap, ([tag, count]) => ({ tag, count }));

    // Updated/Created months — placeholder derived facets
    this.updatedMonths = [{ month: 'March 2026', count: this.areas.length }];
    this.createdMonths = [{ month: 'January 2026', count: this.areas.length }];

    // Last Created Project
    this.lastCreatedProjectOptions = [
      { label: 'This Month', count: this.areas.length }
    ];
  }

  applyFilters() {
    let result = [...this.areas];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(a =>
        a.areaName.toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      );
    }

    this.filteredAreas = result;
  }

  toggleOwner(name: string) {
    this.selectedOwners.has(name) ? this.selectedOwners.delete(name) : this.selectedOwners.add(name);
    this.applyFilters();
  }

  toggleTag(tag: string) {
    this.selectedTags.has(tag) ? this.selectedTags.delete(tag) : this.selectedTags.add(tag);
    this.applyFilters();
  }

  toggleUpdatedMonth(month: string) {
    this.selectedUpdatedMonths.has(month) ? this.selectedUpdatedMonths.delete(month) : this.selectedUpdatedMonths.add(month);
    this.applyFilters();
  }

  toggleCreatedMonth(month: string) {
    this.selectedCreatedMonths.has(month) ? this.selectedCreatedMonths.delete(month) : this.selectedCreatedMonths.add(month);
    this.applyFilters();
  }

  toggleLastCreatedProject(label: string) {
    this.selectedLastCreatedProject.has(label) ? this.selectedLastCreatedProject.delete(label) : this.selectedLastCreatedProject.add(label);
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedOwners.clear();
    this.selectedTags.clear();
    this.selectedUpdatedMonths.clear();
    this.selectedCreatedMonths.clear();
    this.selectedLastCreatedProject.clear();
    this.defaultDisplay = null;
    this.applyFilters();
  }
}

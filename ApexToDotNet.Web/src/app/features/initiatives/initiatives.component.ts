import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { Initiative, Area } from '../../models/strategic-planner.models';

@Component({
  selector: 'app-initiatives',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="apex-page">
      <div class="apex-page-title">
        <h1>Initiatives</h1>
      </div>

      <div *ngIf="loading" class="apex-loading">Loading initiatives...</div>

      <div *ngIf="!loading" class="apex-faceted-layout">
        <!-- Left Column: Faceted Search (APEX Page 21 Faceted Search region) -->
        <div class="apex-facet-panel">
          <div class="facet-search">
            <input
              type="text"
              class="facet-search-input"
              placeholder="Search..."
              [(ngModel)]="searchQuery"
              (input)="applyFilters()">
          </div>

          <!-- Area facet -->
          <div class="facet-group" *ngIf="areaOptions.length > 0">
            <div class="apex-facet-title">▸ Area</div>
            <label *ngFor="let a of areaOptions" class="facet-option">
              <input type="radio" name="area"
                [checked]="selectedArea === a.name"
                (change)="selectedArea = a.name; applyFilters()">
              <span>{{ a.name }} ({{ a.count }})</span>
            </label>
            <label class="facet-option" *ngIf="selectedArea">
              <input type="radio" name="area" (change)="selectedArea = null; applyFilters()">
              <span class="clear-filter">Clear</span>
            </label>
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

          <!-- Created Month facet -->
          <div class="facet-group" *ngIf="createdMonths.length > 0">
            <div class="apex-facet-title">▸ Created Month</div>
            <label *ngFor="let m of createdMonths" class="facet-option">
              <input type="checkbox" [checked]="selectedCreatedMonths.has(m.month)" (change)="toggleCreatedMonth(m.month)">
              <span>{{ m.month }} ({{ m.count }})</span>
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

          <button *ngIf="hasActiveFilters"
            class="apex-btn apex-btn-secondary apex-btn-sm clear-all-btn"
            (click)="clearFilters()">
            Clear All Filters
          </button>
        </div>

        <!-- Body: Initiative Cards -->
        <div class="initiatives-body">
          <div class="results-count" *ngIf="filteredInitiatives.length > 0">
            {{ filteredInitiatives.length }} initiative{{ filteredInitiatives.length !== 1 ? 's' : '' }}
          </div>

          <div class="initiatives-grid">
            <div *ngFor="let initiative of filteredInitiatives" class="initiative-card">
              <div class="card-header">
                <h3 class="initiative-name">{{ initiative.initiativeName }}</h3>
                <div class="badges">
                  <span *ngIf="initiative.statusScale" class="apex-badge apex-badge-blue">
                    {{ initiative.statusScale }}
                  </span>
                </div>
              </div>

              <p class="initiative-description">{{ initiative.objective || 'No description' }}</p>

              <div *ngIf="initiative.area" class="area-tag">
                🎯 {{ initiative.area }}
              </div>

              <div class="initiative-stats">
                <div class="stat-item">
                  <span class="stat-icon">📋</span>
                  <span class="stat-text">{{ initiative.activeProjects || 0 }} projects</span>
                </div>
                <div *ngIf="initiative.sponsor" class="stat-item">
                  <span class="stat-icon">👤</span>
                  <span class="stat-text">{{ initiative.sponsor }}</span>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="filteredInitiatives.length === 0" class="apex-empty-state">
            No initiatives match your criteria.
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

    .initiatives-body {
      min-height: 200px;
    }

    .initiatives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .initiative-card {
      background: white;
      border-radius: 4px;
      padding: 16px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      transition: box-shadow 0.15s;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .initiative-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .initiative-name {
      font-size: 15px;
      font-weight: 600;
      color: #1a73e8;
      margin: 0;
      flex: 1;
    }

    .badges {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .initiative-description {
      color: #555;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .area-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #f5f5f5;
      border-radius: 12px;
      font-size: 12px;
      color: #424242;
      font-weight: 500;
      width: fit-content;
    }

    .initiative-stats {
      display: flex;
      gap: 16px;
      padding: 8px 0;
      border-top: 1px solid #f0f0f0;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }

    .stat-icon {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .initiatives-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InitiativesComponent implements OnInit {
  initiatives: Initiative[] = [];
  filteredInitiatives: Initiative[] = [];
  areas: Area[] = [];
  loading = false;
  searchQuery = '';

  // Facet data
  areaOptions: { name: string; count: number }[] = [];
  uniqueOwners: { name: string; count: number }[] = [];
  uniqueTags: { tag: string; count: number }[] = [];
  createdMonths: { month: string; count: number }[] = [];
  updatedMonths: { month: string; count: number }[] = [];

  // Facet selections
  selectedArea: string | null = null;
  selectedOwners = new Set<string>();
  selectedTags = new Set<string>();
  selectedCreatedMonths = new Set<string>();
  selectedUpdatedMonths = new Set<string>();
  defaultDisplay: string | null = null;

  constructor(private plannerService: StrategicPlannerService) {}

  ngOnInit() {
    this.loadData();
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery.length > 0
      || this.selectedArea !== null
      || this.selectedOwners.size > 0
      || this.selectedTags.size > 0
      || this.selectedCreatedMonths.size > 0
      || this.selectedUpdatedMonths.size > 0
      || this.defaultDisplay !== null;
  }

  loadData() {
    this.loading = true;
    this.plannerService.getInitiatives().subscribe({
      next: (data) => {
        this.initiatives = data;
        this.buildFacets();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading initiatives:', error);
        this.loading = false;
      }
    });
  }

  buildFacets() {
    // Area facet
    const areaMap = new Map<string, number>();
    this.initiatives.forEach(i => {
      if (i.area) {
        areaMap.set(i.area, (areaMap.get(i.area) || 0) + 1);
      }
    });
    this.areaOptions = Array.from(areaMap, ([name, count]) => ({ name, count }));

    // Owner facet — derive from sponsor
    const ownerMap = new Map<string, number>();
    this.initiatives.forEach(i => {
      const owner = i.sponsor || 'Unassigned';
      ownerMap.set(owner, (ownerMap.get(owner) || 0) + 1);
    });
    this.uniqueOwners = Array.from(ownerMap, ([name, count]) => ({ name, count }));

    // Tags — placeholder
    this.uniqueTags = [];

    // Month facets
    this.createdMonths = [{ month: 'January 2026', count: this.initiatives.length }];
    this.updatedMonths = [{ month: 'March 2026', count: this.initiatives.length }];
  }

  applyFilters() {
    let result = [...this.initiatives];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(i =>
        i.initiativeName.toLowerCase().includes(q) ||
        (i.objective || '').toLowerCase().includes(q) ||
        (i.area || '').toLowerCase().includes(q)
      );
    }

    if (this.selectedArea) {
      result = result.filter(i => i.area === this.selectedArea);
    }

    if (this.selectedOwners.size > 0) {
      result = result.filter(i => this.selectedOwners.has(i.sponsor || 'Unassigned'));
    }

    this.filteredInitiatives = result;
  }

  toggleOwner(name: string) {
    this.selectedOwners.has(name) ? this.selectedOwners.delete(name) : this.selectedOwners.add(name);
    this.applyFilters();
  }

  toggleTag(tag: string) {
    this.selectedTags.has(tag) ? this.selectedTags.delete(tag) : this.selectedTags.add(tag);
    this.applyFilters();
  }

  toggleCreatedMonth(month: string) {
    this.selectedCreatedMonths.has(month) ? this.selectedCreatedMonths.delete(month) : this.selectedCreatedMonths.add(month);
    this.applyFilters();
  }

  toggleUpdatedMonth(month: string) {
    this.selectedUpdatedMonths.has(month) ? this.selectedUpdatedMonths.delete(month) : this.selectedUpdatedMonths.add(month);
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedArea = null;
    this.selectedOwners.clear();
    this.selectedTags.clear();
    this.selectedCreatedMonths.clear();
    this.selectedUpdatedMonths.clear();
    this.defaultDisplay = null;
    this.applyFilters();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

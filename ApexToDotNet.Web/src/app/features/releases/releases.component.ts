import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { Release } from '../../models/strategic-planner.models';

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="apex-page">
      <div class="apex-page-title">
        <h1>Releases</h1>
      </div>

      <div *ngIf="loading" class="apex-loading">Loading releases...</div>

      <div *ngIf="!loading" class="apex-faceted-layout">
        <!-- Left Column: Faceted Search (APEX Page 8 Faceted Search region) -->
        <div class="apex-facet-panel">
          <div class="facet-search">
            <input
              type="text"
              class="facet-search-input"
              placeholder="Search..."
              [(ngModel)]="searchQuery"
              (input)="applyFilters()">
          </div>

          <!-- Window facet -->
          <div class="facet-group" *ngIf="windowOptions.length > 0">
            <div class="apex-facet-title">▸ Window</div>
            <label *ngFor="let w of windowOptions" class="facet-option">
              <input type="checkbox" [checked]="selectedWindows.has(w.label)" (change)="toggleWindow(w.label)">
              <span>{{ w.label }} ({{ w.count }})</span>
            </label>
          </div>

          <!-- Release Train facet -->
          <div class="facet-group" *ngIf="trainOptions.length > 0">
            <div class="apex-facet-title">▸ Release Train</div>
            <label *ngFor="let t of trainOptions" class="facet-option">
              <input type="checkbox" [checked]="selectedTrains.has(t.name)" (change)="toggleTrain(t.name)">
              <span>{{ t.name }} ({{ t.count }})</span>
            </label>
          </div>

          <!-- Release Type facet -->
          <div class="facet-group" *ngIf="typeOptions.length > 0">
            <div class="apex-facet-title">▸ Release Type</div>
            <label *ngFor="let t of typeOptions" class="facet-option">
              <input type="checkbox" [checked]="selectedTypes.has(t.type)" (change)="toggleType(t.type)">
              <span>{{ t.type }} ({{ t.count }})</span>
            </label>
          </div>

          <!-- Owner facet -->
          <div class="facet-group" *ngIf="ownerOptions.length > 0">
            <div class="apex-facet-title">▸ Owner</div>
            <label *ngFor="let o of ownerOptions" class="facet-option">
              <input type="checkbox" [checked]="selectedOwners.has(o.name)" (change)="toggleOwner(o.name)">
              <span>{{ o.name }} ({{ o.count }})</span>
            </label>
          </div>

          <!-- Release Year facet -->
          <div class="facet-group" *ngIf="yearOptions.length > 0">
            <div class="apex-facet-title">▸ Release Year</div>
            <label *ngFor="let y of yearOptions" class="facet-option">
              <input type="checkbox" [checked]="selectedYears.has(y.year)" (change)="toggleYear(y.year)">
              <span>{{ y.year }} ({{ y.count }})</span>
            </label>
          </div>

          <button *ngIf="hasActiveFilters"
            class="apex-btn apex-btn-secondary apex-btn-sm clear-all-btn"
            (click)="clearFilters()">
            Clear All Filters
          </button>
        </div>

        <!-- Body: Releases table -->
        <div class="releases-body">
          <div class="results-count" *ngIf="filteredReleases.length > 0">
            {{ filteredReleases.length }} release{{ filteredReleases.length !== 1 ? 's' : '' }}
          </div>

          <div class="apex-region">
            <div class="apex-region-body">
              <table class="apex-report-table" *ngIf="filteredReleases.length > 0">
                <thead>
                  <tr>
                    <th>Release Train</th>
                    <th>Release Name</th>
                    <th>Owner</th>
                    <th>Target Date</th>
                    <th>Type</th>
                    <th>Projects</th>
                    <th>Avg. Completion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of filteredReleases">
                    <td><a>{{ r.releaseTrain }}</a></td>
                    <td>{{ r.releaseName }}</td>
                    <td>{{ r.releaseOwner }}</td>
                    <td>{{ r.releaseTargetDate | date:'mediumDate' }}</td>
                    <td>{{ r.releaseType || '-' }}</td>
                    <td>{{ r.projects || 0 }}</td>
                    <td>
                      <div class="apex-pct-bar">
                        <div class="apex-pct-track">
                          <div class="apex-pct-fill"
                            [ngClass]="getPctClass(r.avgPctComplete)"
                            [style.width.%]="r.avgPctComplete || 0"></div>
                        </div>
                        <span class="apex-pct-label">{{ (r.avgPctComplete || 0) | number:'1.0-0' }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div *ngIf="filteredReleases.length === 0" class="apex-empty-state">
                No releases match your criteria.
              </div>
            </div>
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
    .clear-all-btn {
      width: 100%;
      margin-top: 8px;
    }
    .results-count {
      font-size: 13px;
      color: #888;
      margin-bottom: 12px;
    }
    .releases-body {
      min-height: 200px;
    }
  `]
})
export class ReleasesComponent implements OnInit {
  releases: Release[] = [];
  filteredReleases: Release[] = [];
  loading = true;
  searchQuery = '';

  // Facet data
  windowOptions: { label: string; count: number }[] = [];
  trainOptions: { name: string; count: number }[] = [];
  typeOptions: { type: string; count: number }[] = [];
  ownerOptions: { name: string; count: number }[] = [];
  yearOptions: { year: string; count: number }[] = [];

  // Facet selections
  selectedWindows = new Set<string>();
  selectedTrains = new Set<string>();
  selectedTypes = new Set<string>();
  selectedOwners = new Set<string>();
  selectedYears = new Set<string>();

  constructor(private plannerService: StrategicPlannerService) {}

  ngOnInit() {
    this.plannerService.getReleases().subscribe({
      next: (data) => {
        this.releases = data;
        this.buildFacets();
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery.length > 0
      || this.selectedWindows.size > 0
      || this.selectedTrains.size > 0
      || this.selectedTypes.size > 0
      || this.selectedOwners.size > 0
      || this.selectedYears.size > 0;
  }

  buildFacets() {
    // Window facet — derive from dates
    this.windowOptions = [
      { label: 'Current', count: this.releases.length },
    ];

    // Release Train
    const trainMap = new Map<string, number>();
    this.releases.forEach(r => {
      if (r.releaseTrain) trainMap.set(r.releaseTrain, (trainMap.get(r.releaseTrain) || 0) + 1);
    });
    this.trainOptions = Array.from(trainMap, ([name, count]) => ({ name, count }));

    // Release Type
    const typeMap = new Map<string, number>();
    this.releases.forEach(r => {
      const t = r.releaseType || 'Standard';
      typeMap.set(t, (typeMap.get(t) || 0) + 1);
    });
    this.typeOptions = Array.from(typeMap, ([type, count]) => ({ type, count }));

    // Owner
    const ownerMap = new Map<string, number>();
    this.releases.forEach(r => {
      if (r.releaseOwner) ownerMap.set(r.releaseOwner, (ownerMap.get(r.releaseOwner) || 0) + 1);
    });
    this.ownerOptions = Array.from(ownerMap, ([name, count]) => ({ name, count }));

    // Year
    const yearMap = new Map<string, number>();
    this.releases.forEach(r => {
      const year = r.releaseTargetDate ? new Date(r.releaseTargetDate).getFullYear().toString() : 'Unknown';
      yearMap.set(year, (yearMap.get(year) || 0) + 1);
    });
    this.yearOptions = Array.from(yearMap, ([year, count]) => ({ year, count }));
  }

  applyFilters() {
    let result = [...this.releases];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        (r.releaseTrain || '').toLowerCase().includes(q) ||
        (r.releaseName || '').toLowerCase().includes(q) ||
        (r.releaseOwner || '').toLowerCase().includes(q)
      );
    }

    if (this.selectedTrains.size > 0) {
      result = result.filter(r => this.selectedTrains.has(r.releaseTrain));
    }

    if (this.selectedTypes.size > 0) {
      result = result.filter(r => this.selectedTypes.has(r.releaseType || 'Standard'));
    }

    if (this.selectedOwners.size > 0) {
      result = result.filter(r => this.selectedOwners.has(r.releaseOwner || ''));
    }

    if (this.selectedYears.size > 0) {
      result = result.filter(r => {
        const year = r.releaseTargetDate ? new Date(r.releaseTargetDate).getFullYear().toString() : 'Unknown';
        return this.selectedYears.has(year);
      });
    }

    this.filteredReleases = result;
  }

  toggleWindow(label: string) {
    this.selectedWindows.has(label) ? this.selectedWindows.delete(label) : this.selectedWindows.add(label);
    this.applyFilters();
  }
  toggleTrain(name: string) {
    this.selectedTrains.has(name) ? this.selectedTrains.delete(name) : this.selectedTrains.add(name);
    this.applyFilters();
  }
  toggleType(type: string) {
    this.selectedTypes.has(type) ? this.selectedTypes.delete(type) : this.selectedTypes.add(type);
    this.applyFilters();
  }
  toggleOwner(name: string) {
    this.selectedOwners.has(name) ? this.selectedOwners.delete(name) : this.selectedOwners.add(name);
    this.applyFilters();
  }
  toggleYear(year: string) {
    this.selectedYears.has(year) ? this.selectedYears.delete(year) : this.selectedYears.add(year);
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedWindows.clear();
    this.selectedTrains.clear();
    this.selectedTypes.clear();
    this.selectedOwners.clear();
    this.selectedYears.clear();
    this.applyFilters();
  }

  getPctClass(pct: number | undefined): string {
    if (!pct || pct === 0) return 'pct-low';
    if (pct < 50) return 'pct-low';
    if (pct < 80) return 'pct-mid';
    if (pct < 100) return 'pct-high';
    return 'pct-done';
  }
}

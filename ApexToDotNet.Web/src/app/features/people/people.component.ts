import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { TeamMember } from '../../models/strategic-planner.models';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="apex-page">
      <div class="apex-page-title">
        <h1>People</h1>
      </div>

      <div *ngIf="loading" class="apex-loading">Loading team members...</div>

      <div *ngIf="!loading" class="apex-faceted-layout">
        <!-- Left Column: Faceted Search (APEX Page 74 Faceted Search region) -->
        <div class="apex-facet-panel">
          <div class="facet-search">
            <input
              type="text"
              class="facet-search-input"
              placeholder="Search..."
              [(ngModel)]="searchQuery"
              (input)="applyFilters()">
          </div>

          <!-- App Role facet -->
          <div class="facet-group" *ngIf="appRoles.length > 0">
            <div class="apex-facet-title">▸ App Role</div>
            <label *ngFor="let r of appRoles" class="facet-option">
              <input type="checkbox" [checked]="selectedRoles.has(r.role)" (change)="toggleRole(r.role)">
              <span>{{ r.role }} ({{ r.count }})</span>
            </label>
          </div>

          <!-- Competencies facet -->
          <div class="facet-group" *ngIf="competencies.length > 0">
            <div class="apex-facet-title">▸ Competencies</div>
            <label *ngFor="let c of competencies" class="facet-option">
              <input type="checkbox" [checked]="selectedCompetencies.has(c.name)" (change)="toggleCompetency(c.name)">
              <span>{{ c.name }} ({{ c.count }})</span>
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

          <!-- Open Reviews facet -->
          <div class="facet-group">
            <div class="apex-facet-title">▸ Open Reviews</div>
            <label class="facet-option">
              <input type="checkbox" [checked]="filterOpenReviews" (change)="filterOpenReviews = !filterOpenReviews; applyFilters()">
              <span>Yes</span>
            </label>
          </div>

          <!-- Groups facet -->
          <div class="facet-group" *ngIf="groups.length > 0">
            <div class="apex-facet-title">▸ Groups</div>
            <label *ngFor="let g of groups" class="facet-option">
              <input type="checkbox" [checked]="selectedGroups.has(g.name)" (change)="toggleGroup(g.name)">
              <span>{{ g.name }} ({{ g.count }})</span>
            </label>
          </div>

          <!-- Region facet -->
          <div class="facet-group" *ngIf="regions.length > 0">
            <div class="apex-facet-title">▸ Region</div>
            <label *ngFor="let r of regions" class="facet-option">
              <input type="checkbox" [checked]="selectedRegions.has(r.name)" (change)="toggleRegion(r.name)">
              <span>{{ r.name }} ({{ r.count }})</span>
            </label>
          </div>

          <!-- Country facet -->
          <div class="facet-group" *ngIf="countries.length > 0">
            <div class="apex-facet-title">▸ Country</div>
            <label *ngFor="let c of countries" class="facet-option">
              <input type="checkbox" [checked]="selectedCountries.has(c.name)" (change)="toggleCountry(c.name)">
              <span>{{ c.name }} ({{ c.count }})</span>
            </label>
          </div>

          <!-- Current or Future Activities facet -->
          <div class="facet-group">
            <div class="apex-facet-title">▸ Current or Future Activities</div>
            <label class="facet-option">
              <input type="radio" name="activityFilter"
                [checked]="activityFilter === 'current'"
                (change)="activityFilter = 'current'; applyFilters()">
              <span>Current</span>
            </label>
            <label class="facet-option">
              <input type="radio" name="activityFilter"
                [checked]="activityFilter === 'future'"
                (change)="activityFilter = 'future'; applyFilters()">
              <span>Future</span>
            </label>
            <label class="facet-option" *ngIf="activityFilter">
              <input type="radio" name="activityFilter" (change)="activityFilter = null; applyFilters()">
              <span class="clear-filter">Clear</span>
            </label>
          </div>

          <!-- Email Domain facet -->
          <div class="facet-group" *ngIf="emailDomains.length > 0">
            <div class="apex-facet-title">▸ Email Domain</div>
            <label *ngFor="let d of emailDomains" class="facet-option">
              <input type="checkbox" [checked]="selectedDomains.has(d.domain)" (change)="toggleDomain(d.domain)">
              <span>{{ d.domain }} ({{ d.count }})</span>
            </label>
          </div>

          <!-- Project Owner facet -->
          <div class="facet-group">
            <div class="apex-facet-title">▸ Project Owner</div>
            <label class="facet-option">
              <input type="checkbox" [checked]="filterProjectOwner" (change)="filterProjectOwner = !filterProjectOwner; applyFilters()">
              <span>Yes</span>
            </label>
          </div>

          <!-- Has Profile Photo facet -->
          <div class="facet-group">
            <div class="apex-facet-title">▸ Has Profile Photo</div>
            <label class="facet-option">
              <input type="radio" name="hasPhoto"
                [checked]="hasProfilePhoto === 'Y'"
                (change)="hasProfilePhoto = 'Y'; applyFilters()">
              <span>Yes</span>
            </label>
            <label class="facet-option">
              <input type="radio" name="hasPhoto"
                [checked]="hasProfilePhoto === 'N'"
                (change)="hasProfilePhoto = 'N'; applyFilters()">
              <span>No</span>
            </label>
            <label class="facet-option" *ngIf="hasProfilePhoto">
              <input type="radio" name="hasPhoto" (change)="hasProfilePhoto = null; applyFilters()">
              <span class="clear-filter">Clear</span>
            </label>
          </div>

          <!-- Has Screen Name facet -->
          <div class="facet-group">
            <div class="apex-facet-title">▸ Has Screen Name</div>
            <label class="facet-option">
              <input type="radio" name="hasScreenName"
                [checked]="hasScreenName === 'Y'"
                (change)="hasScreenName = 'Y'; applyFilters()">
              <span>Yes</span>
            </label>
            <label class="facet-option">
              <input type="radio" name="hasScreenName"
                [checked]="hasScreenName === 'N'"
                (change)="hasScreenName = 'N'; applyFilters()">
              <span>No</span>
            </label>
            <label class="facet-option" *ngIf="hasScreenName">
              <input type="radio" name="hasScreenName" (change)="hasScreenName = null; applyFilters()">
              <span class="clear-filter">Clear</span>
            </label>
          </div>

          <button *ngIf="hasActiveFilters"
            class="apex-btn apex-btn-secondary apex-btn-sm clear-all-btn"
            (click)="clearFilters()">
            Clear All Filters
          </button>
        </div>

        <!-- Body: People Cards -->
        <div class="people-body">
          <div class="results-count" *ngIf="filteredPeople.length > 0">
            {{ filteredPeople.length }} {{ filteredPeople.length !== 1 ? 'people' : 'person' }}
          </div>

          <div class="apex-cards">
            <div *ngFor="let person of filteredPeople" class="apex-card">
              <div class="person-avatar">
                {{ getInitials(person) }}
              </div>
              <div class="apex-card-title">{{ person.firstName }} {{ person.lastName }}</div>
              <div class="apex-card-body">
                <div *ngIf="person.jobTitle" class="person-detail">{{ person.jobTitle }}</div>
                <div *ngIf="person.department" class="person-detail">{{ person.department }}</div>
                <div *ngIf="person.email" class="person-detail">📧 {{ person.email }}</div>
              </div>
              <div class="apex-card-footer">
                <span class="apex-badge" [ngClass]="person.isCurrentYn === 'Y' ? 'apex-badge-green' : 'apex-badge-gray'">
                  {{ person.isCurrentYn === 'Y' ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <div *ngIf="filteredPeople.length === 0" class="apex-empty-state" style="grid-column: 1 / -1;">
              No team members match your criteria.
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
    .people-body {
      min-height: 200px;
    }
    .person-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #1b2636;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .person-detail {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;
    }
  `]
})
export class PeopleComponent implements OnInit {
  people: TeamMember[] = [];
  filteredPeople: TeamMember[] = [];
  loading = true;
  searchQuery = '';

  // Facet data
  appRoles: { role: string; count: number }[] = [];
  competencies: { name: string; count: number }[] = [];
  uniqueTags: { tag: string; count: number }[] = [];
  groups: { name: string; count: number }[] = [];
  regions: { name: string; count: number }[] = [];
  countries: { name: string; count: number }[] = [];
  emailDomains: { domain: string; count: number }[] = [];

  // Facet selections
  selectedRoles = new Set<string>();
  selectedCompetencies = new Set<string>();
  selectedTags = new Set<string>();
  selectedGroups = new Set<string>();
  selectedRegions = new Set<string>();
  selectedCountries = new Set<string>();
  selectedDomains = new Set<string>();
  filterOpenReviews = false;
  filterProjectOwner = false;
  activityFilter: string | null = null;
  hasProfilePhoto: string | null = null;
  hasScreenName: string | null = null;

  constructor(private plannerService: StrategicPlannerService) {}

  ngOnInit() {
    this.plannerService.getTeamMembers().subscribe({
      next: (data) => {
        this.people = data;
        this.buildFacets();
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery.length > 0
      || this.selectedRoles.size > 0
      || this.selectedCompetencies.size > 0
      || this.selectedTags.size > 0
      || this.selectedGroups.size > 0
      || this.selectedRegions.size > 0
      || this.selectedCountries.size > 0
      || this.selectedDomains.size > 0
      || this.filterOpenReviews
      || this.filterProjectOwner
      || this.activityFilter !== null
      || this.hasProfilePhoto !== null
      || this.hasScreenName !== null;
  }

  buildFacets() {
    // App Role — derive from jobTitle
    const roleMap = new Map<string, number>();
    this.people.forEach(p => {
      const role = p.jobTitle || 'Member';
      roleMap.set(role, (roleMap.get(role) || 0) + 1);
    });
    this.appRoles = Array.from(roleMap, ([role, count]) => ({ role, count }));

    // Competencies — placeholder
    this.competencies = [];

    // Tags — placeholder
    this.uniqueTags = [];

    // Groups — placeholder
    this.groups = [];

    // Region — placeholder
    this.regions = [];

    // Country — placeholder
    this.countries = [];

    // Email domains
    const domainMap = new Map<string, number>();
    this.people.forEach(p => {
      if (p.email) {
        const domain = p.email.split('@')[1] || 'unknown';
        domainMap.set(domain, (domainMap.get(domain) || 0) + 1);
      }
    });
    this.emailDomains = Array.from(domainMap, ([domain, count]) => ({ domain, count }));
  }

  applyFilters() {
    let result = [...this.people];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.firstName || '').toLowerCase().includes(q) ||
        (p.lastName || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.jobTitle || '').toLowerCase().includes(q) ||
        (p.department || '').toLowerCase().includes(q)
      );
    }

    if (this.selectedRoles.size > 0) {
      result = result.filter(p => this.selectedRoles.has(p.jobTitle || 'Member'));
    }

    if (this.selectedDomains.size > 0) {
      result = result.filter(p => {
        const domain = p.email ? p.email.split('@')[1] : '';
        return this.selectedDomains.has(domain);
      });
    }

    this.filteredPeople = result;
  }

  toggleRole(role: string) {
    this.selectedRoles.has(role) ? this.selectedRoles.delete(role) : this.selectedRoles.add(role);
    this.applyFilters();
  }
  toggleCompetency(name: string) {
    this.selectedCompetencies.has(name) ? this.selectedCompetencies.delete(name) : this.selectedCompetencies.add(name);
    this.applyFilters();
  }
  toggleTag(tag: string) {
    this.selectedTags.has(tag) ? this.selectedTags.delete(tag) : this.selectedTags.add(tag);
    this.applyFilters();
  }
  toggleGroup(name: string) {
    this.selectedGroups.has(name) ? this.selectedGroups.delete(name) : this.selectedGroups.add(name);
    this.applyFilters();
  }
  toggleRegion(name: string) {
    this.selectedRegions.has(name) ? this.selectedRegions.delete(name) : this.selectedRegions.add(name);
    this.applyFilters();
  }
  toggleCountry(name: string) {
    this.selectedCountries.has(name) ? this.selectedCountries.delete(name) : this.selectedCountries.add(name);
    this.applyFilters();
  }
  toggleDomain(domain: string) {
    this.selectedDomains.has(domain) ? this.selectedDomains.delete(domain) : this.selectedDomains.add(domain);
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedRoles.clear();
    this.selectedCompetencies.clear();
    this.selectedTags.clear();
    this.selectedGroups.clear();
    this.selectedRegions.clear();
    this.selectedCountries.clear();
    this.selectedDomains.clear();
    this.filterOpenReviews = false;
    this.filterProjectOwner = false;
    this.activityFilter = null;
    this.hasProfilePhoto = null;
    this.hasScreenName = null;
    this.applyFilters();
  }

  getInitials(person: TeamMember): string {
    return ((person.firstName?.[0] || '') + (person.lastName?.[0] || '')).toUpperCase();
  }
}

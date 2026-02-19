# Component Patterns Guide

## 🎨 How to Add New Components

This guide shows you the patterns established in the Strategic Planner app so you can easily add more components.

## 📁 Folder Structure

```
src/app/
├── core/
│   └── layout/              # Layout components (header, sidenav, main)
├── shared/
│   └── components/          # Reusable components (badges, filters, search)
├── features/
│   ├── home/                # Dashboard/home page
│   ├── projects/            # Projects feature
│   ├── areas/               # Areas feature
│   └── ...                  # Other features
├── models/                  # TypeScript interfaces
├── services/                # API services
└── app.routes.ts            # Route configuration
```

## 🧱 Component Structure

### List Component Pattern

Used for: Projects List, Activities List, People List

**Example**: `projects-list.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StrategicPlannerService } from '../../../services/strategic-planner.service';
import { Project } from '../../../models/strategic-planner.models';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Projects</h1>
        <button class="btn-primary" (click)="createNew()">
          + New Project
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <!-- Add your filters here -->
      </div>

      <!-- Table or Card Grid -->
      <div class="data-section">
        <table *ngIf="items.length > 0">
          <!-- Table content -->
        </table>

        <div *ngIf="items.length === 0" class="empty-state">
          <span class="empty-icon">📋</span>
          <p>No items found</p>
        </div>
      </div>
    </div>
  `,
  styles: [/* Component styles */]
})
export class ProjectsListComponent implements OnInit {
  items: Project[] = [];
  loading = false;

  constructor(private service: StrategicPlannerService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.searchProjects('').subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  createNew() {
    // Navigate to create page
  }
}
```

---

### Card Grid Component Pattern

Used for: Areas, Initiatives

**Example**: `areas.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StrategicPlannerService } from '../../services/strategic-planner.service';
import { Area } from '../../models/strategic-planner.models';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Areas</h1>
      </div>

      <div class="cards-grid">
        <div *ngFor="let area of areas" class="area-card">
          <div class="card-header">
            <h3>{{ area.name }}</h3>
          </div>
          <p class="card-description">{{ area.description }}</p>
          <div class="card-footer">
            <span>{{ area.projectCount }} projects</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .area-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  `]
})
export class AreasComponent implements OnInit {
  areas: Area[] = [];

  constructor(private service: StrategicPlannerService) {}

  ngOnInit() {
    this.service.getAreas().subscribe({
      next: (data) => this.areas = data,
      error: (error) => console.error('Error loading areas:', error)
    });
  }
}
```

---

### Dashboard Component Pattern

Used for: Home page with stats and recent items

**Structure**:
1. Stats cards at top
2. Recent items section
3. Activity feed

See `home.component.ts` for complete example.

---

## 🎨 Styling Patterns

### Priority Badges

```html
<span class="priority-badge priority-{{ item.priority }}">
  P{{ item.priority }}
</span>
```

CSS classes: `.priority-1` through `.priority-5`

### Status Badges

```html
<span class="status-badge status-{{ item.status | lowercase }}">
  {{ item.status }}
</span>
```

CSS classes: `.status-active`, `.status-completed`, `.status-on-hold`

### Size Badges

```html
<span class="size-badge size-{{ item.size | lowercase }}">
  {{ item.size }}
</span>
```

CSS classes: `.size-xs`, `.size-s`, `.size-m`, `.size-l`, `.size-xl`

---

## 🛣️ Adding Routes

In `app.routes.ts`:

```typescript
{
  path: 'your-feature',
  loadComponent: () => import('./features/your-feature/your-feature.component')
    .then(m => m.YourFeatureComponent)
}
```

---

## 🔌 Adding Service Methods

In `strategic-planner.service.ts`:

```typescript
getYourData(): Observable<YourType[]> {
  return this.http.get<YourType[]>(`${this.apiUrl}/api/your-endpoint`);
}

searchYourData(query: string): Observable<YourType[]> {
  return this.http.get<YourType[]>(
    `${this.apiUrl}/api/your-endpoint/search?q=${encodeURIComponent(query)}`
  );
}

createYourData(data: YourType): Observable<YourType> {
  return this.http.post<YourType>(`${this.apiUrl}/api/your-endpoint`, data);
}
```

---

## 📦 Creating Reusable Components

### Search Bar Component

```typescript
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar">
      <input 
        type="text" 
        class="search-input"
        [(ngModel)]="searchText"
        (input)="onSearch()"
        placeholder="Search...">
    </div>
  `,
  styles: [/* styles */]
})
export class SearchBarComponent {
  searchText = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchText);
  }
}
```

Usage:
```html
<app-search-bar (search)="handleSearch($event)"></app-search-bar>
```

---

## 🧪 Testing Components

Create a test file alongside your component:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YourComponent } from './your.component';

describe('YourComponent', () => {
  let component: YourComponent;
  let fixture: ComponentFixture<YourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(YourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## 🎯 Common Patterns

### Loading State

```typescript
loading = false;

loadData() {
  this.loading = true;
  this.service.getData().subscribe({
    next: (data) => {
      this.items = data;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error:', error);
      this.loading = false;
    }
  });
}
```

Template:
```html
<div *ngIf="loading" class="loading-container">
  <div class="loading-spinner"></div>
</div>

<div *ngIf="!loading">
  <!-- Your content -->
</div>
```

### Error Handling

```typescript
errorMessage = '';

handleError(error: any) {
  console.error('Error:', error);
  this.errorMessage = error.message || 'An error occurred';
}
```

Template:
```html
<div *ngIf="errorMessage" class="error-message">
  {{ errorMessage }}
</div>
```

---

## 🚀 Quick Generate Commands

Use Angular CLI to generate components quickly:

```bash
# Generate a feature component
ng generate component features/your-feature --standalone

# Generate a shared component
ng generate component shared/components/your-component --standalone

# Generate a service
ng generate service services/your-service

# Generate a model
ng generate interface models/your-model
```

---

## 📋 Checklist for New Components

- [ ] Create component file in appropriate folder
- [ ] Import necessary modules (CommonModule, RouterModule, etc.)
- [ ] Make component `standalone: true`
- [ ] Add route to `app.routes.ts`
- [ ] Create service methods if needed
- [ ] Add TypeScript interfaces to models file
- [ ] Style using established patterns
- [ ] Test component loads correctly
- [ ] Add error handling
- [ ] Add loading states

---

## 💡 Tips

1. **Keep components small** - Break down into smaller reusable pieces
2. **Use standalone components** - Easier to lazy load
3. **Follow naming conventions** - feature-name.component.ts
4. **Reuse styles** - Use global classes from styles.css
5. **Type everything** - Use TypeScript interfaces for all data
6. **Handle errors** - Always add error handling in subscribe
7. **Add loading states** - Better UX during API calls

---

Happy coding! 🎉

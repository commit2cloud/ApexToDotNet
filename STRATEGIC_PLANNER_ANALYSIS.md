# Strategic Planner - UI Analysis

## 📊 Homepage Analysis (from Screenshot)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Our Strategic Planner" + User Menu (admin)       │
└─────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────────┐
│          │  Main Content Area                               │
│  Left    │  ┌────────────────────────────────────────────┐ │
│  Nav     │  │ Title: "Our Strategic Planner"             │ │
│          │  │ View Projects button (top right)           │ │
│  - Home  │  ├────────────────────────────────────────────┤ │
│  - Areas │  │ Search: "Search Projects"                  │ │
│  - Init. │  ├────────────────────────────────────────────┤ │
│  - Proj. │  │ My Initiatives                             │ │
│  - Grps  │  │ (No data found)                            │ │
│  - Act.  │  ├────────────────────────────────────────────┤ │
│  - Rel.  │  │ My Open Releases                           │ │
│  - People│  │ (No data found)                            │ │
│  - PGrps │  ├────────────────────────────────────────────┤ │
│  - Rpts  │  │ Recently Changed Projects                  │ │
│          │  │ [Table with 6 projects]                    │ │
│          │  └────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────┘
```

### Navigation Items (with badges)

| Item | Icon | Badge Count |
|------|------|-------------|
| Home | 🏠 | - |
| Areas | 📋 | 2 |
| Initiatives | 🎯 | 5 |
| Projects | 📁 | 6 |
| Project Groups | 👥 | 6 |
| Activities | ⚡ | 5 |
| Releases | 🚀 | 2 |
| People | 👤 | 5 |
| People Groups | 👥 | 0 |
| Reports | 📊 | - |

### Data Models Identified

#### Project
```typescript
interface Project {
  id: number;
  name: string;
  attributes: {
    priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
    status: 'M' | 'L' | 'S' | 'XL'; // Size indicators
    completion: number; // percentage (20%, 30%, 50%, 70%)
    target: string; // "Alpha R1 L0", "No Target"
  };
  initiative: string; // "Initiative 1", "Initiative 2", etc.
  updatedAt: string; // "7h"
  updatedBy: string; // "admin"
}
```

#### Sample Data from Screenshot
```typescript
const projects = [
  {
    name: "Project 1",
    attributes: { priority: "P2", status: "M", completion: 70, target: "Alpha R1 L0" },
    initiative: "Initiative 1",
    updated: "7h - admin"
  },
  {
    name: "Jira-3254 We need to fix something",
    attributes: { priority: "P1", status: "S", completion: 30, target: "No Target" },
    initiative: "Initiative 1",
    updated: "7h - admin"
  },
  {
    name: "Sales Blitz 1",
    attributes: { priority: "P1", status: "L", completion: 10, target: "No Target" },
    initiative: "Initiative 2",
    updated: "7h - admin"
  }
  // ... more projects
];
```

### UI Components Needed

1. **AppComponent**
   - Overall layout container
   - Router outlet

2. **HeaderComponent**
   - App title
   - User menu
   - Notifications icon

3. **SidenavComponent**
   - Navigation menu
   - Badge counters
   - Icons

4. **HomeComponent**
   - Search bar
   - My Initiatives section (empty state)
   - My Open Releases section (empty state)
   - Recently Changed Projects table

5. **ProjectTableComponent** (reusable)
   - Columns: Project, Attributes, Initiative, Updated
   - Priority badges
   - Status indicators
   - Clickable project names

### Color Scheme

- **Header**: Dark gray/charcoal (#3e3e3e)
- **Accent Banner**: Multi-color gradient (teal, orange, pink, green)
- **Background**: White (#ffffff)
- **Nav background**: Light gray (#f5f5f5)
- **Nav hover**: Slightly darker gray
- **Badges**: 
  - P1: Red/Orange
  - P2: Yellow/Orange
  - P4: Blue
  - P5: Green
  - Numbers in circles: Various colors

### Responsive Considerations

- Collapsible sidebar for mobile
- Table becomes scrollable on small screens
- Search bar full width on mobile

---

## 🎨 Next Steps

I'll now generate:
1. Angular components matching this layout
2. TypeScript models for all data types
3. Services for API calls
4. Routing configuration
5. Material Design or custom styling to match

Generating code now...

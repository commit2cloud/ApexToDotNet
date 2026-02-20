# Efficient Prompting Guide for APEX to .NET Migration

This guide provides optimized prompts based on lessons learned from building this POC. Use these to accelerate future development.

---

## 🚀 Quick Start: Initial Project Setup

### Super-Efficient Single Prompt

```
I have Oracle APEX 24.2 Strategic Planner app screenshots. Create an Angular 17 + .NET 10 
migration POC with:

1. Match the APEX UI exactly (navigation menu with badges, Projects list with filters/search/cards, 
   Projects detail with 10 tabs, Sessions calendar using FullCalendar)
2. Use standalone components, mock data (30+ projects), responsive design
3. Navigation order: Home, Areas, Initiatives, Projects, Project Groups, Activities, Releases, 
   People, People Groups, Reports
4. Security-ready: comprehensive .gitignore (no .env, credentials, build artifacts), sanitized 
   configs with placeholders only
5. Customer-ready docs: README with "Try It Yourself", what works vs TODO, architecture diagram
6. Create startup script to run both servers (API on 5000, Angular on 4200)

[attach APEX screenshots]
```

### Two-Phase Approach (If Preferred)

**Phase 1 - Core Development:**
```
Create Angular 17 + .NET 10 app mirroring this APEX Strategic Planner. Match UI exactly: 
navigation (with badge counts), Projects list (filters/search/cards), Projects detail (10 tabs), 
Sessions calendar. Use standalone components, mock data, responsive design. 

[attach screenshots]
```

**Phase 2 - Production Ready:**
```
Make this production-ready for customer demo: 
1. Security audit - update .gitignore for all secrets/credentials/build artifacts, sanitize all 
   configs to placeholders
2. Customer-ready README with quick start + what works vs TODO
3. Create run script for both servers
4. Reorder nav menu to match APEX: Home, Areas, Initiatives, Projects, Project Groups, Activities, 
   Releases, People, People Groups, Reports
```

---

## 📸 Adding/Updating APEX Features

### Best Prompt Template for New Features

```
Add [FEATURE_NAME] module to match this APEX screen:

**Requirements:**
- Match APEX UI exactly (describe key elements: filters, tabs, cards, tables, etc.)
- Include [specific interactions: search, sort, pagination, modals, etc.]
- Follow existing patterns from Projects module
- Use mock data (X+ realistic records)
- Responsive design
- Add to navigation menu at position [X]

**Specific Elements to Include:**
- [List key UI components from screenshot]
- [Any special interactions or workflows]
- [Data relationships with existing modules]

[attach APEX screenshots here]
```

### Example: Adding Activities Module

```
Add Activities module to match this APEX screen:

**Requirements:**
- Match APEX UI exactly: list view with activity cards, status badges, date filters
- Include search, sort by date/status, pagination
- Follow existing patterns from Projects module
- Use mock data (25+ realistic activities)
- Responsive design
- Add to navigation menu after Initiatives

**Specific Elements to Include:**
- Activity cards with title, description, status badge, assigned person, due date
- Left sidebar with filters: Status (Planned/In Progress/Complete), Date Range, Assigned To
- "Add Activity" button in header
- Click activity to open detail modal with edit capability

[attach 2 screenshots: list view and detail modal]
```

---

## 📁 Where to Put Screenshots

### Recommended Screenshot Organization

```
ApexToDotNet/
├── screenshots/
│   ├── apex-originals/           # Original APEX app screenshots
│   │   ├── 01-navigation.png     # Full nav menu with badges
│   │   ├── 02-home-dashboard.png
│   │   ├── 03-projects-list.png
│   │   ├── 04-projects-detail.png
│   │   ├── 05-sessions-calendar.png
│   │   ├── 06-activities-list.png
│   │   ├── 07-people-list.png
│   │   └── ...
│   ├── feature-requests/         # New features to add
│   │   ├── areas-module.png
│   │   ├── releases-module.png
│   │   └── ...
│   └── comparisons/              # Side-by-side APEX vs Angular
│       ├── projects-comparison.png
│       └── ...
```

### How to Reference Screenshots in Prompts

**Option 1 - Attach Directly (Best):**
```
Add Releases module matching this APEX screen. [attach screenshot directly to prompt]
```

**Option 2 - Reference Existing Files:**
```
Add Releases module matching screenshots/apex-originals/08-releases-list.png
```

**Option 3 - Multiple Screenshots:**
```
Add Activities module with:
- List view: [attach activities-list.png]
- Detail view: [attach activities-detail.png]
- Create form: [attach activities-create.png]
```

---

## ⚡ Key Efficiency Principles

### 1. **Be Specific Upfront**
❌ "Create a projects module"
✅ "Create Projects list with left sidebar filters (Status, Owner, Release), search bar, card grid layout, and 'Create Project' button"

### 2. **Attach Screenshots Immediately**
- Don't wait for AI to ask
- Include all views (list, detail, edit, modals)
- Capture full screen to show context (nav, filters, etc.)

### 3. **Specify Tech Stack Versions**
❌ "Use Angular and .NET"
✅ "Use Angular 17 standalone components, .NET 10 Web API, APEX 24.2"

### 4. **Bundle Related Requests**
❌ Three separate prompts for: security, docs, scripts
✅ "Make production-ready: security audit + customer docs + run scripts"

### 5. **Reference Existing Patterns**
✅ "Follow the Projects module pattern" (reuses established code structure)
✅ "Match the card layout from Projects list" (consistent UI)

### 6. **Request "Production-Ready" or "Customer-Ready"**
- Triggers comprehensive quality checks
- Includes security, docs, and polish automatically

### 7. **Specify Exact UI Elements**
List what you see:
- "Left sidebar with collapsible filter sections"
- "Card grid with hover effects"
- "Badge counts on navigation items"
- "Tabs with icons and counts"
- "Progress bars with percentage"

### 8. **Include Data Requirements**
✅ "Mock data with 30+ projects, diverse statuses, realistic dates"
✅ "Sample data showing all edge cases (0%, 50%, 100% complete)"

---

## 🎯 Prompt Template for Different Scenarios

### Scenario 1: Brand New Module

```
Create [MODULE_NAME] module matching this APEX screen:

**UI Components:**
- [Main layout: list/grid/calendar/table]
- [Filters/search elements]
- [Action buttons]
- [Detail views/modals]

**Functionality:**
- [CRUD operations needed]
- [Sorting/filtering/pagination]
- [Interactions with other modules]

**Data:**
- Mock data with [X+] records
- Include [specific fields/relationships]

**Navigation:**
- Add to menu at position [X] with badge count

[attach screenshots: list view, detail view, any modals/forms]
```

### Scenario 2: Enhance Existing Module

```
Enhance [MODULE_NAME] with these features from APEX:

**Add:**
- [New UI element 1]
- [New UI element 2]
- [New functionality]

**Keep Existing:**
- Current layout and styling
- All existing features

[attach screenshot showing new features]
```

### Scenario 3: Match Styling/Layout

```
Update [MODULE_NAME] styling to exactly match this APEX screen:

**Style Changes:**
- [Color/spacing/layout differences]
- [Card/table/form styling]
- [Icons/badges/buttons]

**Keep:**
- All existing functionality
- Current data and interactions

[attach comparison: current vs desired]
```

### Scenario 4: Fix/Reorder Navigation

```
Reorder navigation menu to match APEX:
1. [Item 1]
2. [Item 2]
3. [Item 3]
...

[attach screenshot of APEX navigation]
```

### Scenario 5: Responsive/Mobile View

```
Make [MODULE_NAME] responsive matching APEX mobile view:

**Mobile Requirements:**
- [Mobile-specific layout changes]
- [Collapsible/hamburger menus]
- [Touch-friendly interactions]

[attach desktop and mobile screenshots]
```

---

## 🎬 Complete Example Workflow

### Goal: Add "Areas" Module

**Step 1: Prepare Screenshots**
```bash
# Save screenshots to organized location
screenshots/apex-originals/
├── 10-areas-list.png       # Full screen with nav, filters, cards
├── 11-areas-detail.png     # Detail view with tabs
└── 12-areas-create.png     # Create/edit form
```

**Step 2: Use Optimized Prompt**
```
Add Areas module matching these APEX screens:

**UI Components:**
- Left sidebar with filters: Status (Active/Inactive), Owner (dropdown), Area Type (checkboxes)
- Main content: Card grid layout showing area name, description, owner, # of projects, status badge
- Header: "Areas" title + "Create Area" button
- Detail view: Tabs for Overview, Projects (list of linked projects), Activities, Notes

**Functionality:**
- Search by area name/description
- Sort by: Name, Owner, # Projects, Created Date
- Click card → detail view with 4 tabs
- "Create Area" opens modal form

**Data:**
- Mock data with 15+ areas
- Include various statuses and owners
- Link to existing projects where relevant

**Navigation:**
- Add to menu at position 2 (after Home) with badge count

**Pattern:**
- Follow Projects module structure (filters, cards, detail tabs)
- Reuse card hover effects and styling

[attach areas-list.png, areas-detail.png, areas-create.png]
```

**Step 3: Follow-Up (if needed)**
```
Minor adjustments:
- Update card spacing to 16px (currently 20px)
- Change status badge colors to match APEX (Active=green, Inactive=gray)
- Add area icon 🎯 to navigation
```

---

## 🔧 Troubleshooting Prompts

### If Output Doesn't Match

```
The [MODULE_NAME] layout doesn't match APEX. Specific differences:
1. [Difference 1] - Should be [Expected]
2. [Difference 2] - Should be [Expected]

[attach side-by-side comparison screenshot]
```

### If Missing Features

```
Add these missing features to [MODULE_NAME] from APEX:
- [Missing feature 1]
- [Missing feature 2]

[attach screenshot highlighting missing elements]
```

### If Styling Is Off

```
Update [MODULE_NAME] styling to match APEX exactly:
- Font sizes: [current] → [expected]
- Colors: [current] → [expected]
- Spacing: [current] → [expected]
- Layout: [describe difference]

[attach screenshot with annotations]
```

---

## 📊 Efficiency Metrics from This Project

**Traditional Approach:** ~172 hours
**AI-Assisted with Prompts Used:** ~2 hours
**Potential with Optimized Prompts:** ~30-45 minutes

**Efficiency Multiplier:**
- Good prompts: **86x faster**
- Optimized prompts: **~230x faster**

---

## 💡 Pro Tips

1. **Create a screenshot library** as you explore APEX - capture everything
2. **Name screenshots descriptively** (not "Screenshot 2026-02-20.png")
3. **Use consistent terminology** from APEX UI in prompts
4. **Reference existing modules** to maintain consistency
5. **Bundle similar requests** (all styling, all new features, etc.)
6. **Be explicit about responsive behavior** if visible in screenshots
7. **Mention badge counts, icons, colors** - details matter
8. **Include edge cases in mock data requests** (empty states, 100% complete, etc.)
9. **Request "customer-ready" for final polish** - includes security, docs, scripts
10. **Keep a prompt journal** - note what worked well for reuse

---

## 📝 Quick Reference Card

### Minimum Effective Prompt Structure

```
[ACTION] [MODULE/FEATURE] matching [SOURCE]:

Requirements:
- [UI components]
- [Functionality] 
- [Data needs]
- [Navigation/placement]

[attach screenshots]
```

### Power Words for Better Results

- **"Match exactly"** - Triggers precise replication
- **"Follow existing pattern from [X]"** - Ensures consistency
- **"Production-ready"** - Adds security, docs, polish
- **"Customer-ready"** - Adds demo quality
- **"Include mock data with [X+] records"** - Gets realistic samples
- **"Responsive design"** - Adds mobile support
- **"Use standalone components"** - Modern Angular architecture

---

## 🎓 Learning from This Project

### What Worked Best
1. ✅ Attaching screenshots immediately with first prompt
2. ✅ Specifying "match exactly" with detailed UI descriptions
3. ✅ Requesting "production-ready" for bundled cleanup
4. ✅ Referencing existing patterns ("like Projects module")
5. ✅ Bundling security + docs + scripts in one prompt

### What Could Have Been Better
1. ⚠️ Should have specified nav order in initial prompt
2. ⚠️ Could have requested startup scripts from the beginning
3. ⚠️ Should have mentioned "customer-ready docs" upfront
4. ⚠️ Could have been more specific about mock data variety

### Biggest Time Savers
1. 🚀 "Production-ready" keyword (triggered comprehensive security/docs)
2. 🚀 Attaching all screenshots at once (avoided back-and-forth)
3. 🚀 Requesting "follow Projects pattern" (consistent structure)

---

## 🔄 Iterative Development Pattern

For complex features, use this cycle:

1. **Big Picture Prompt** → Get overall structure
2. **Detail Prompts** → Refine specific areas
3. **Polish Prompt** → Final customer-ready touches

Example:
```
Prompt 1: "Create Activities module with list and detail views [screenshots]"
Prompt 2: "Add advanced filters and date range picker to Activities"
Prompt 3: "Make Activities production-ready with responsive design"
```

---

## 📞 Support

For questions about using these prompts:
- Review existing modules as examples
- Check screenshots/apex-originals/ for reference
- See IMPLEMENTATION_SUMMARY.md for architecture patterns

---

**Last Updated:** February 20, 2026
**Project:** ApexToDotNet Migration POC
**Success Rate:** 86x efficiency improvement with good prompts

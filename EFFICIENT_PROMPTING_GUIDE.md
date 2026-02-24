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

## �️ Working with SQL and Database Operations

### Scenario 1: Generate SQL Scripts from APEX Data

**Best Use Case:** Syncing APEX data to Angular for demos

```
Create a SQL script that:
1. Queries the APEX [TABLE_NAME] table
2. Generates TypeScript code for Angular service
3. Formats as copy/paste ready array of objects
4. Handles nulls, escapes quotes, includes all fields
5. Outputs to DBMS_OUTPUT with clear markers

**Fields to include:** [list all fields]
**Target format:** TypeScript interface compatible
**Output location:** apex-exports/sync-[name]-to-angular.sql

Example for People table with fields: id, first_name, last_name, email, country
```

**Example Output from This Project:**
```sql
-- apex-exports/sync-people-to-angular.sql
SET SERVEROUTPUT ON SIZE UNLIMITED;
DECLARE
  v_output CLOB;
BEGIN
  -- Query data and generate TypeScript
  FOR record IN (SELECT * FROM people ORDER BY id) LOOP
    -- Build TypeScript object
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('>>> START COPY >>>');
  DBMS_OUTPUT.PUT_LINE(v_output);
  DBMS_OUTPUT.PUT_LINE('>>> END COPY >>>');
END;
/
```

### Scenario 2: Create Database Schema from APEX

```
Create SQL DDL scripts for [MODULE_NAME] tables:

**Tables Needed:**
- [TABLE_1]: [description, key fields]
- [TABLE_2]: [description, key fields]

**Requirements:**
- Oracle syntax compatible with APEX 24.2
- Primary keys, foreign keys, indexes
- Sequences for ID generation
- Comments on tables and columns
- Sample INSERT statements (10+ rows per table)

**Output:** 
- schema/[module]-schema.sql (DDL)
- schema/[module]-data.sql (sample data)
```

### Scenario 3: ORDS REST API Endpoint Scripts

```
Create ORDS REST API definition for [MODULE_NAME]:

**Endpoints:**
- GET /api/[module] (list with pagination, filters)
- GET /api/[module]/:id (single record)
- POST /api/[module] (create)
- PUT /api/[module]/:id (update)
- DELETE /api/[module]/:id (delete)

**Requirements:**
- ORDS module and template definitions
- Handler PL/SQL procedures
- Input validation
- Error handling with proper HTTP status codes
- JSON response format

**Output:** ords-definitions/[module]-ords.sql
```

### Scenario 4: Data Migration Scripts

```
Create migration script to copy data from APEX tables to new schema:

**Source:** APEX workspace tables (projects, people, areas)
**Target:** New normalized schema
**Transformations:**
- [Field mapping differences]
- [Data cleanup/validation rules]
- [Relationship updates]

**Include:**
- Rollback procedures
- Validation queries before/after
- Transaction handling
- Progress logging
```

### Scenario 5: Query APEX Metadata

```
Create SQL queries to extract APEX application metadata:

**Information Needed:**
- All tables used by app [APP_ID]
- Page definitions and navigation structure
- Authorization schemes
- Application items and session state
- LOVs (List of Values) definitions

**Use APEX views:** apex_application_pages, apex_application_page_items, etc.
**Output:** documentation/apex-metadata-queries.sql
```

### Scenario 6: Database Health Checks

```
Create SQL health check script for APEX application database:

**Checks:**
- Table sizes and row counts
- Index usage and missing indexes
- Foreign key integrity
- Orphaned records
- Data quality issues (nulls, duplicates)
- Performance bottlenecks

**Output:** 
- HTML report format
- Include recommendations
- Highlight issues by severity
```

---

## 🔧 SQL Script Best Practices (From This Project)

### Key Elements to Request

1. **SET Commands for Output:**
```sql
SET SERVEROUTPUT ON SIZE UNLIMITED
SET FEEDBACK OFF
SET HEADING OFF
```

2. **Clear Output Markers:**
```sql
DBMS_OUTPUT.PUT_LINE('>>> START COPY >>>');
-- Generated content here
DBMS_OUTPUT.PUT_LINE('>>> END COPY >>>');
```

3. **Error Handling:**
```sql
BEGIN
  -- Your code
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('Error: No data found');
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
```

4. **Verification Queries:**
```sql
-- At the end, always include verification
SELECT COUNT(*) as total_records FROM table_name;
SELECT * FROM table_name WHERE id <= 5; -- Sample data
```

5. **Documentation:**
```sql
-- ================================================
-- Script Purpose: [What it does]
-- Author: [Name]
-- Date: [Date]
-- Usage: Run in SQL Workshop → SQL Commands
-- ================================================
```

### SQL Prompt Template

```
Create SQL script for [PURPOSE]:

**Script Requirements:**
- Oracle PL/SQL syntax (APEX 24.2 compatible)
- SET SERVEROUTPUT ON for DBMS_OUTPUT
- Clear section headers with comments
- Error handling with EXCEPTION blocks
- Verification queries at end
- Output markers (>>> START/END >>>)

**Input:** [Source tables/data]
**Output:** [Target format/tables]
**Location:** [File path in project]

**Specific Logic:**
- [Step 1]
- [Step 2]
- [Step 3]
```

---

## 📊 SQL + UI Integration Prompts

### Scenario: Complete Data Flow Demo

```
Create complete data sync demo from APEX to Angular:

**Components Needed:**
1. SQL script (apex-exports/sync-[name].sql):
   - Query APEX table
   - Generate TypeScript array
   - Clear copy/paste markers
   
2. Angular service update instructions:
   - Which file to modify
   - Exactly where to paste
   - How to verify it worked

3. Demo documentation (DEMO_[NAME].md):
   - Step-by-step walkthrough
   - Screenshots to take
   - Expected results
   - Troubleshooting section

**Example from project:** See DEMO_ADD_PEOPLE.md + sync-people-to-angular.sql
```

### Scenario: Mock Data That Matches Real Schema

```
Create mock data matching APEX schema for [MODULE]:

**Source:** Query APEX data dictionary
**Generate:** 
- TypeScript interfaces from table columns
- Mock data generator with realistic values
- 30+ sample records showing variety

**SQL Query Template:**
```sql
SELECT column_name, data_type, data_length, nullable
FROM user_tab_columns 
WHERE table_name = '[TABLE_NAME]'
ORDER BY column_id;
```

**Output:** 
- models/[module].ts (interfaces)
- services/[module]-mock-data.ts (sample data)
```

---

## 🎯 SQL Efficiency Tips

### 1. Request Executable Scripts, Not Fragments
❌ "Write a query to get projects"
✅ "Create complete executable SQL script in apex-exports/get-projects.sql with SERVEROUTPUT, error handling, and verification"

### 2. Specify Output Format Precisely
❌ "Generate data for Angular"
✅ "Generate TypeScript array format: `[{ id: 1, name: 'Test' }, ...]` with proper escaping and null handling"

### 3. Include File Organization
✅ "Put DDL in schema/, DML in data/, sync scripts in apex-exports/, ORDS in ords-definitions/"

### 4. Request Both Directions
✅ "Create sync script for APEX → Angular AND reverse sync script for Angular → APEX"

### 5. Bundle Related SQL Work
✅ "Create complete database layer: schema DDL, sample data, ORDS endpoints, sync scripts, verification queries"

---

## 📝 SQL Quick Reference

### Common APEX Views for Queries

```sql
-- Application metadata
apex_applications
apex_application_pages
apex_application_page_items

-- Workspace users and permissions
apex_workspace_apex_users
apex_workspace_developers

-- Data dictionary
user_tables
user_tab_columns
user_constraints
user_indexes

-- ORDS definitions
user_ords_modules
user_ords_templates
user_ords_handlers
```

### Typical Script Locations in Project

```
ApexToDotNet/
├── apex-exports/          # Export scripts, data sync
│   ├── sampleapp.sql
│   ├── schema.sql
│   └── sync-*-to-angular.sql
├── schema/                # DDL definitions
│   ├── tables.sql
│   └── indexes.sql
├── data/                  # Sample/seed data
│   └── sample-data.sql
├── ords-definitions/      # ORDS REST API defs
│   └── *-ords.sql
└── sql-utilities/         # Helper scripts
    ├── health-check.sql
    └── metadata-export.sql
```

---

## �📸 Adding/Updating APEX Features

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
11. **Request executable SQL scripts, not fragments** - include SET commands, error handling, verification
12. **Organize SQL by purpose** - schema/, data/, apex-exports/, ords-definitions/
13. **Always request output markers in SQL** - >>> START/END >>> for easy copy/paste
14. **Bundle SQL with documentation** - script + usage instructions + expected output

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
- **"Executable SQL script"** - Gets complete runnable code, not fragments
- **"With SERVEROUTPUT"** - Ensures SQL output visibility
- **"Include verification queries"** - Adds sanity checks to SQL scripts
- **"Output markers"** - Gets >>> START/END >>> for easy copy/paste

---

## 🎓 Learning from This Project

### What Worked Best
1. ✅ Attaching screenshots immediately with first prompt
2. ✅ Specifying "match exactly" with detailed UI descriptions
3. ✅ Requesting "production-ready" for bundled cleanup
4. ✅ Referencing existing patterns ("like Projects module")
5. ✅ Bundling security + docs + scripts in one prompt
6. ✅ Requesting executable SQL scripts with output markers and verification
7. ✅ Creating SQL → Angular data sync workflows with documentation

### What Could Have Been Better
1. ⚠️ Should have specified nav order in initial prompt
2. ⚠️ Could have requested startup scripts from the beginning
3. ⚠️ Should have mentioned "customer-ready docs" upfront
4. ⚠️ Could have been more specific about mock data variety
5. ⚠️ Should have requested SQL script organization structure upfront

### Biggest Time Savers
1. 🚀 "Production-ready" keyword (triggered comprehensive security/docs)
2. 🚀 Attaching all screenshots at once (avoided back-and-forth)
3. 🚀 Requesting "follow Projects pattern" (consistent structure)
4. 🚀 SQL scripts with clear output markers (>>> START/END >>>) for easy copy/paste
5. 🚀 Bundling SQL + TypeScript + documentation in single request

---

## 🔄 Iterative Development Pattern

For complex features, use this cycle:

1. **Big Picture Prompt** → Get overall structure
2. **Detail Prompts** → Refine specific areas
3. **Polish Prompt** → Final customer-ready touches

**UI Example:**
```
Prompt 1: "Create Activities module with list and detail views [screenshots]"
Prompt 2: "Add advanced filters and date range picker to Activities"
Prompt 3: "Make Activities production-ready with responsive design"
```

**SQL Example:**
```
Prompt 1: "Create SQL script to query APEX people table and generate TypeScript array"
Prompt 2: "Add null handling, quote escaping, and clear output markers"
Prompt 3: "Bundle with demo documentation showing how to use the script"
```

**Complete Feature Example:**
```
Prompt 1: "Create People module matching APEX [screenshots]"
Prompt 2: "Add SQL script to sync APEX people data to Angular"
Prompt 3: "Create demo walkthrough with SQL and screenshot options"
```

---

## 📞 Support

For questions about using these prompts:
- Review existing modules as examples
- Check screenshots/apex-originals/ for reference
- See IMPLEMENTATION_SUMMARY.md for architecture patterns
- Check apex-exports/ for SQL script examples
- See DEMO_ADD_PEOPLE.md for complete SQL + UI integration workflow

---

**Last Updated:** February 24, 2026
**Project:** ApexToDotNet Migration POC
**Success Rate:** 86x efficiency improvement with good prompts
**Key Addition:** SQL integration patterns and best practices for APEX data operations

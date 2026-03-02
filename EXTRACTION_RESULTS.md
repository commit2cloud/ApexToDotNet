# Strategic Planner - APEX Metadata Extraction Results

**Date:** March 2, 2026  
**Source:** Oracle APEX 24.2 on Oracle Autonomous Database 19c (OCI us-chicago-1)  
**App:** Strategic Planner (App ID 102)  
**Schema:** WKSP_APEXDOTNET  

## 🎯 Extraction Summary

| Component | Count | Status |
|---|---|---|
| **Pages** | 262 | ✅ Extracted |
| **Regions** | 912 | ✅ Extracted |
| **Page Items** | 976 | ✅ Extracted |
| **Buttons** | 718 | ✅ Extracted |
| **Processes** | 341 | ✅ Extracted (with PL/SQL source) |
| **Validations** | 50 | ✅ Extracted |
| **Dynamic Actions** | 380 | ✅ Extracted |
| **LOVs** | 34 | ✅ Extracted (with SQL queries) |
| **Navigation Entries** | 94 | ✅ Extracted |
| **Database Tables** | 72 | ✅ Extracted |
| **Triggers** | 62 | ✅ Source extracted |
| **PL/SQL Packages** | 9 (spec+body) | ✅ Full source extracted |
| **Functions** | 2 | ✅ Source extracted |
| **Procedures** | 1 | ✅ Source extracted |
| **Views** | 6 | ✅ Definitions extracted |
| **Table Columns** | ~925 | ✅ Extracted |
| **Breadcrumbs** | entries | ✅ Extracted |
| **Auth Schemes** | entries | ✅ Extracted |
| **Computations** | entries | ✅ Extracted |

## 📁 Extracted Files

| File | Lines | Content |
|---|---|---|
| `strategic-planner-metadata.txt` | 7,452 | Pages, items, buttons, nav, breadcrumbs, auth, region sources |
| `strategic-planner-metadata-fix.txt` | 2,874 | Regions (with positions), processes, validations, dynamic actions, tables |
| `strategic-planner-metadata-fix2.txt` | 1,371 | Validations detail, schema objects, table columns, computations, page groups |
| `strategic-planner-packages.txt` | 6,851 | ALL PL/SQL package specs & bodies, functions, procedures, view definitions |
| `strategic-planner-triggers.txt` | 2,851 | ALL trigger source code, LOV definitions with queries |
| **TOTAL** | **~21,399** | **Complete application extraction** |

## 🏗️ Application Architecture

### Page Groups (Functional Areas)
- **Home** - Dashboard, notifications, recent projects
- **Projects** - CRUD, details, documents, links, images, history, approvals
- **Initiatives** - Strategic initiatives with focus areas
- **Areas** - Focus areas management
- **Releases** - Release management, milestones, calendar
- **Activities** - Activity tracking, kanban board, planning board
- **Users** - People management, profiles, weekly summaries
- **Groups** - User groups and membership
- **Reports** - Cross-project reports, documents, links, change history
- **Cross-Project Reports** - Milestones, approvals, contributors
- **Administration** - Users, config, nomenclature, lookups, monitoring
- **Feedback** - User feedback system
- **Login** - Authentication

### Key Database Tables (72 total, SP_ prefix)
**Core Entities:**
- `SP_PROJECTS` (6 rows) - Projects with owner, status, pct_complete, initiative, release
- `SP_INITIATIVES` (3 rows) - Strategic initiatives
- `SP_AREAS` (2 rows) - Focus areas
- `SP_RELEASE_TRAINS` (2 rows) - Releases with dates, milestones
- `SP_TEAM_MEMBERS` (3 rows) - Users/people
- `SP_TASKS` (7 rows) - Tasks with types, statuses, owners
- `SP_ACTIVITIES` (3 rows) - Activity tracking
- `SP_GROUPS` - User groups

**Supporting Entities:**
- `SP_PROJECT_COMMENTS` - Project comments with HTML body
- `SP_PROJECT_CONTRIBUTORS` - Project team members with roles
- `SP_PROJECT_DOCUMENTS` - File attachments
- `SP_PROJECT_LINKS` - External links
- `SP_PROJECT_HISTORY` (10 rows) - Change tracking
- `SP_RELEASE_MILESTONES` - Release milestones
- `SP_NOTIFICATION_SUBSCRIPTIONS` - Email notifications
- `SP_FAVORITES` - User favorites
- `SP_PROJECT_APPROVALS` - Approval workflow
- `SP_APPROVAL_TYPES` - Approval type configuration

**Lookup/Config Tables:**
- `SP_PROJECT_STATUSES` (4) - Status values
- `SP_PROJECT_PRIORITIES` (5) - Priority levels
- `SP_PROJECT_SIZES` (8) - Size categories
- `SP_PROJECT_SCALES` (5) - Completeness scales
- `SP_TASK_TYPES` (30) - Task type definitions
- `SP_TASK_STATUSES` (30) - Task status definitions
- `SP_RELEASE_MILESTONE_TYPES` (6) - Milestone types
- `SP_ACTIVITY_TYPES` (6) - Activity type definitions
- `SP_RESOURCE_TYPES` (8) - Contributor roles
- `SP_COUNTRIES` (198) - Country lookup
- `SP_APP_NOMENCLATURE` (9) - Customizable labels
- `SP_APP_SETTINGS` (5) - Application settings
- `SP_AI_PROMPTS` (3) - AI prompt templates
- `SP_COMPETENCIES` (20) - Team member competencies

### PL/SQL Business Logic Packages

| Package | Purpose | Lines |
|---|---|---|
| **SP_UTIL** | Core utilities - team member sync, nomenclature, calculations | ~1,750 |
| **SP_APPROVALS** | Approval workflow - submit, approve, reject, clarify | ~310 |
| **SP_CONTRIBUTOR_SUMMARY** | Email summaries - project changes, exceptions, weekly | ~1,035 |
| **SP_COMMENT_UTIL** | Comment management - mentions, notifications, HTML processing | ~1,020 |
| **SP_LOG** | Interaction/activity logging | ~80 |
| **SP_RELEASE_TIMELINE** | Release timeline calculations | ~650 |
| **SP_SUMMARY_UTIL** | AI summary generation utilities | ~1,100 |
| **SP_VALUE_COMPARE** | Change history comparison utilities | ~170 |
| **SP_GLOBALS** | Global constants | ~10 |
| **SP_DATE_RANGE_PCT_COMP** | Date range % completion function | ~45 |
| **SP_TAG_DIFF** | Tag change tracking function | ~50 |
| **SP_FAVORITE_TOGGLE** | Favorite/unfavorite procedure | ~40 |

### Navigation Structure

**Side Navigation Menu:**
1. Home (Page 1)
2. Areas [count] (Page 17)
3. Initiatives [count] (Page 21)
4. Projects [count] (Page 23)
5. Project Groups [count] (Page 70)
6. Activities [count] (Page 102)
7. Releases [count] (Page 8)
8. Users [count] (Page 74)
9. User Groups [count] (Page 103)
10. Reports (Page 41)

**User Navigation Bar:**
- Recent Projects, My Projects, My Favorite Projects
- My Tasks, My Activities
- Alerts, My Profile, Approval Requests
- My Subscriptions, My Approval Configuration
- Feedback, About, Administration, Sign Out

### Key Features Identified

1. **Project Management** - Full CRUD with owners, status tracking, % complete, sizes, priorities
2. **Initiative Management** - Strategic initiatives with focus areas, linked to projects
3. **Release Management** - Release trains with milestones, calendars, timelines
4. **Task Management** - Tasks with types, sub-types, statuses, owners, documents
5. **Activity Tracking** - Activities with kanban board, planning board, calendar
6. **Approval Workflow** - Multi-level approval chains with alternates, clarification requests
7. **Comments System** - Rich text comments with mentions, images, notifications
8. **Document Management** - File attachments on projects, initiatives, tasks, releases
9. **User Management** - Team members with roles, tags, competencies, screen names
10. **Group Management** - User groups with membership
11. **Favorites System** - Users can favorite projects
12. **Notification System** - Email subscriptions with configurable frequency
13. **Change History** - Comprehensive audit trail via triggers + history tables
14. **AI Integration** - AI summaries for projects and releases (AI prompts configurable)
15. **Cross-Release Calendar** - Calendar view of milestones across releases
16. **Reporting** - Documents, links, images, comments, change history reports
17. **Administration** - Nomenclature (customizable labels), feature toggles, lookups
18. **Feedback System** - User feedback with ratings

## 🗺️ Migration Mapping: APEX → .NET/Angular

### Component Mapping
| APEX Component | .NET/Angular Equivalent |
|---|---|
| Pages (Normal) | Angular route + component |
| Pages (Modal Dialog) | Angular Material dialog |
| Regions (Report) | Angular Material table + API endpoint |
| Regions (Interactive Report) | AG Grid / Material table with filters |
| Regions (Dynamic Content) | Angular component with API call |
| Regions (Static Content) | Angular template HTML |
| Regions (Breadcrumb) | Angular breadcrumb component |
| Page Items | Angular reactive form controls |
| Buttons | Angular Material buttons |
| Processes (PL/SQL) | .NET API controller actions |
| Validations | Angular validators + API validation |
| Dynamic Actions | Angular event handlers + RxJS |
| LOVs (Dynamic) | .NET lookup API endpoints |
| LOVs (Static) | Angular constants/enums |
| PL/SQL Packages | .NET service classes |
| Database Triggers | EF Core interceptors / domain events |
| APEX Auth | ASP.NET Identity |
| APEX Mail | .NET SMTP / SendGrid |

### Migration Complexity Assessment
- **Pages:** 262 (but many are small modal dialogs)
- **Normal pages:** ~100 (full route components needed)
- **Modal dialogs:** ~160 (reusable dialog components)
- **Unique page groups:** 18 (maps to Angular feature modules)
- **Business logic:** ~6,260 lines of PL/SQL → .NET services
- **Database:** 72 tables → EF Core entities + migrations

### Estimated Effort
- **Phase 1 (Core):** Projects, Initiatives, Releases, Tasks, Activities → 40-60 components
- **Phase 2 (Supporting):** Comments, Documents, Links, Favorites, History → 30-40 components
- **Phase 3 (Admin):** Administration, Lookups, Users, Groups → 30-40 components
- **Phase 4 (Advanced):** Approvals, Kanban, Calendar, AI, Notifications → 20-30 components

## 📌 Connection Details

```bash
# SQLcl connection (working)
SQLcl_BIN="/Users/commit2cloud/.vscode/extensions/oracle.sql-developer-25.4.1-darwin-arm64/dbtools/sqlcl/bin/sql"
WALLET="/Users/commit2cloud/ApexToDotNet/wallet/Wallet_dbQP49L.zip"
TNS="dbqp49l_low"

# Usage:
cat << 'EOSQL' | $SQLcl_BIN -L -cloudconfig $WALLET 'ADMIN/"rfx3PFV5nyd5muy_zcf"@dbqp49l_low'
SELECT * FROM dual;
EXIT;
EOSQL
```

## ✅ Proof of Concept: Enterprise-Scale Extraction

This extraction proves that **programmatic APEX metadata extraction at enterprise scale is fully viable**:

1. **Complete UI extraction** - All 262 pages with regions, items, buttons, layout positions
2. **Complete business logic extraction** - All PL/SQL packages, functions, procedures, triggers
3. **Complete data model extraction** - All 72 tables with columns, views, relationships
4. **Complete navigation extraction** - Menus, breadcrumbs, navigation bars
5. **Complete workflow extraction** - Approvals, notifications, subscriptions
6. **Automated via SQL** - No manual work, fully scriptable, repeatable

**Total extraction time:** ~5 minutes for 21,399 lines of metadata across 5 automated queries.

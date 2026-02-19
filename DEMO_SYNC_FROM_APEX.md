# Demo: Syncing Changes from APEX to Angular/.NET

**Purpose**: Demonstrate how to update the Angular/.NET application when changes are made to the APEX Strategic Planner app.

**Time Required**: 5-10 minutes

---

## 📋 Demo Scenario

**Change**: Add a new project status to the APEX app and sync it to the Angular/.NET frontend.

---

## Step 1: Make a Change in APEX (2 minutes)

### Option A: Add a New Project Status

1. **Login to APEX**
   - Navigate to your APEX instance
   - Login to workspace: `apexdotnet`
   - Open app: Strategic Planner (App 102)

2. **Edit the Projects List Page**
   - Go to: Page 2 (Projects)
   - Find the "Status" select list or LOV (List of Values)

3. **Add New Status Value**
   - Navigate to: Shared Components → List of Values
   - Find: PROJECT_STATUS_LOV
   - Add new static value:
     ```
     Display Value: Under Review
     Return Value: UNDER_REVIEW
     ```
   - Save Changes

### Option B: Update a Project's Description

1. **Run the APEX App**
   - Click "Run Application"
   - Navigate to Projects page
   - Edit any project (e.g., "Project 1")

2. **Make a Simple Change**
   ```
   Original: "Customer Portal Redesign"
   Updated: "Customer Portal Redesign - Phase 2"
   ```
   - Save the change

---

## Step 2: Export Updated Data from APEX (1 minute)

### Export the Schema/Data

```sql
-- Connect to your APEX workspace database

-- Export Projects table data
SELECT * FROM PROJECTS 
WHERE project_id = 1;

-- Or export as JSON for easy transfer
SELECT JSON_OBJECT(
  'project_id' VALUE project_id,
  'project_name' VALUE project_name,
  'description' VALUE description,
  'status' VALUE status,
  'priority' VALUE priority,
  'progress_pct' VALUE progress_pct
) as project_json
FROM PROJECTS 
WHERE project_id = 1;
```

**Quick Export Command**:
```bash
# Save to a file you can reference
sqlplus username/password@database << EOF > apex_project_export.json
SELECT JSON_ARRAYAGG(
  JSON_OBJECT(
    'id' VALUE project_id,
    'name' VALUE project_name,
    'description' VALUE description,
    'status' VALUE status,
    'owner' VALUE project_owner
  )
) FROM PROJECTS;
EXIT;
EOF
```

---

## Step 3: Update the Angular/.NET Mock Data (3 minutes)

### Update TypeScript Model

If you added a new status, update the model first:

**File**: `ApexToDotNet.Web/src/app/models/project.ts`

```typescript
export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Open' | 'In Progress' | 'On Hold' | 'Completed' | 'Under Review'; // Added new status
  priority: number;
  // ... rest of interface
}
```

### Update Mock Data

**File**: `ApexToDotNet.Web/src/app/services/project.service.ts`

Find the `mockProjects` array and update:

```typescript
private mockProjects: Project[] = [
  {
    id: 1,
    name: 'Customer Portal Redesign - Phase 2', // Updated from APEX
    description: 'Modernize customer portal...',
    status: 'Under Review', // New status from APEX
    priority: 1,
    // ... rest of properties
  },
  // ... other projects
];
```

### Update .NET Model (if needed)

**File**: `ApexToDotNet.API/Models/Project.cs`

```csharp
public class Project
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    
    // Update allowed values in validation or enum
    public string Status { get; set; } // "Open", "In Progress", "Under Review", etc.
    
    // ... rest of properties
}
```

---

## Step 4: Update UI to Show New Values (2 minutes)

### Update Status Filter

**File**: `ApexToDotNet.Web/src/app/features/projects/project-list/project-list.component.ts`

```typescript
statusOptions = [
  { label: 'Open', value: 'Open', count: 0 },
  { label: 'In Progress', value: 'In Progress', count: 0 },
  { label: 'On Hold', value: 'On Hold', count: 0 },
  { label: 'Under Review', value: 'Under Review', count: 0 }, // New status
  { label: 'Completed', value: 'Completed', count: 0 }
];
```

### Update Status Badge CSS (if needed)

**File**: `ApexToDotNet.Web/src/app/features/projects/project-list/project-list.component.css`

```css
.badge-status.under-review {
  background-color: #ffc107;
  color: #333;
}
```

---

## Step 5: Test the Changes (2 minutes)

### Restart the Angular App

```bash
# Stop the Angular dev server (Ctrl+C)

# Restart it
cd ApexToDotNet.Web
ng serve

# Or if already running, it should auto-reload
```

### Verify in Browser

1. Navigate to: http://localhost:4200/projects
2. Check that:
   - Project 1 shows updated name "Customer Portal Redesign - Phase 2"
   - Status filter includes "Under Review"
   - Status badge displays correctly with new styling

---

## 🤖 Automated Update Command

**For Future Use**: Instead of manually updating, use this prompt with GitHub Copilot:

```
Update the Angular project mock data to match the latest APEX export.

APEX Changes:
- Project 1 name changed to: "Customer Portal Redesign - Phase 2"
- New status added: "Under Review" (value: UNDER_REVIEW)

Files to update:
1. ApexToDotNet.Web/src/app/models/project.ts - Add "Under Review" to status type
2. ApexToDotNet.Web/src/app/services/project.service.ts - Update mockProjects array
3. ApexToDotNet.Web/src/app/features/projects/project-list/project-list.component.ts - Add to statusOptions
4. ApexToDotNet.Web/src/app/features/projects/project-list/project-list.component.css - Add .badge-status.under-review style

Please update these files to reflect the APEX changes.
```

---

## 🔄 Full Sync Process (Future Phase)

When ORDS integration is complete, the sync will be automatic:

```bash
# 1. Make change in APEX
# 2. Change is saved to Oracle database via APEX
# 3. Angular app calls .NET API
# 4. .NET API calls ORDS REST endpoint
# 5. ORDS returns fresh data from database
# 6. UI updates automatically - no code changes needed!
```

**Configuration** (when ready):
```typescript
// Switch from mock data to live ORDS data
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  useOrds: true  // Change this to enable ORDS
};
```

---

## 📊 Demo Script Summary

### What This Demonstrates

✅ **Manual Sync Process** (Current POC phase)
- How to export changes from APEX
- Where to update Angular models and mock data
- How to test changes in the UI

✅ **Future Automation** (With ORDS)
- Changes in APEX automatically appear in Angular
- No code updates needed
- Real-time data synchronization

### Time Investment

| Phase | Current (Manual) | Future (ORDS) |
|-------|------------------|---------------|
| Make APEX change | 2 min | 2 min |
| Export data | 1 min | N/A (automatic) |
| Update code | 3 min | N/A (automatic) |
| Test changes | 2 min | 30 sec (refresh) |
| **Total** | **~8 min** | **~2.5 min** |

---

## 🎯 Next Steps After Demo

1. **Show Customer**:
   - "Here's how we keep the Angular app in sync with APEX changes"
   - "Currently manual, but demonstrates the pattern"

2. **Discuss ORDS Integration**:
   - "With ORDS endpoints, this becomes automatic"
   - "No code changes needed for data updates"
   - "30-60 minutes to set up ORDS REST endpoints"

3. **Demo the Value**:
   - "Both applications can run side-by-side"
   - "Gradual migration - no big bang cutover"
   - "Users can switch between APEX and Angular as features migrate"

---

## 📝 Demo Checklist

Before presenting to customer:

- [ ] APEX app is accessible and running
- [ ] Angular app is running (http://localhost:4200)
- [ ] .NET API is running (http://localhost:5000)
- [ ] Browser dev tools open to show network requests
- [ ] This demo script printed or visible on second screen
- [ ] Sample APEX change identified (project name or status)
- [ ] Code editor ready to show file updates

---

**Demo Duration**: 5-10 minutes  
**Audience**: Technical stakeholders who want to understand the sync process  
**Key Message**: "Currently manual, becomes automatic with ORDS integration"

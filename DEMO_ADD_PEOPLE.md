# 🎯 Demo Script: Sync APEX People Data to Angular App

**Demo Goal**: Show how existing APEX data can be instantly mirrored in the Angular/.NET application

**Time Required**: ~5 minutes

**What You'll Demonstrate**:
1. View existing people in APEX Strategic Planner (Jane Doe, John Doe, Scott Tiger)
2. Export their data using either SQL script OR screenshots
3. Update the Angular app with the APEX data
4. See the people appear in the Angular UI instantly - matching APEX exactly!

---

## 📋 Prerequisites Checklist

Before starting the demo:
- [ ] APEX Strategic Planner app is accessible
- [ ] Angular app is running on http://localhost:4200
- [ ] .NET API is running on http://localhost:5000
- [ ] You can view the APEX People section

---

## 🎬 Demo Options

**Choose your preferred method:**

### Option A: SQL Script Method (Fastest - 3 minutes)
- ✅ Automated
- ✅ Gets real data from APEX
- ✅ Professional, repeatable
- ✅ Best for technical audiences

### Option B: Screenshot Method (Visual - 5 minutes)
- ✅ Manual but intuitive
- ✅ Good for visual verification
- ✅ Best for business audiences
- ✅ Shows exact UI matching

---

## Option A: SQL Script Method (Recommended)

### Step 1: View APEX People Data (1 minute)

1. **Open APEX Strategic Planner:**
   ```
   https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/r/apexdotnet/strategic-planner/people
   ```

2. **Login if prompted:**
   - Workspace: `APEXDOTNET`
   - Username: (your username)
   - Password: (your password)

3. **You should see 3 people:**
   - Jane Doe (jane.doe@acme.com)
   - John Doe (john.doe@acme.com)
   - Scott Tiger (scott.tiger@acme.com)

4. **Show the filters on the left:**
   - App Role: No Access (3)
   - Country: United States (3)
   - Email Domain: acme.com (3)

**Talking Point:** 
> "Here's our APEX Strategic Planner with three people already in the system. Notice the familiar APEX interface with filters on the left. Now let's sync this data to our modern Angular application."

---

### Step 2: Run SQL Sync Script (1 minute)

1. **Open APEX SQL Workshop:**
   ```
   https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apex
   ```
   
2. **Navigate to:** SQL Workshop → SQL Commands

3. **Run the sync script:**
   ```bash
   # The script is located at:
   /Users/commit2cloud/ApexToDotNet/apex-exports/sync-people-to-angular.sql
   ```

4. **Copy the generated TypeScript code** (between the >>> arrows >>>)

**Talking Point:**
> "This SQL script queries the APEX database and generates TypeScript code for our Angular application. It's pulling the exact same data you just saw in the APEX UI."

---

### Step 3: Update Angular App (1 minute)

1. **Open the People Service:**
   ```bash
   code /Users/commit2cloud/ApexToDotNet/ApexToDotNet.Web/src/app/services/strategic-planner.service.ts
   ```

2. **Find the `getPeople()` method** (around line 100)

3. **Replace the entire method content** with the copied TypeScript code

4. **Save the file** (Cmd+S / Ctrl+S)

**Talking Point:**
> "I'm pasting the generated code into our Angular service. Watch what happens when I save... [save file] ...Angular automatically reloads!"

---

### Step 4: Verify in Angular (30 seconds)

1. **Open Angular app:** http://localhost:4200

2. **Click "People" in the left navigation**

3. **Verify the data matches APEX:**
   - ✅ Jane Doe (jane.doe@acme.com - United States)
   - ✅ John Doe (john.doe@acme.com - United States)  
   - ✅ Scott Tiger (scott.tiger@acme.com - United States)

4. **Show the filters match:**
   - ✅ Country: United States (3)
   - ✅ Email Domain: acme.com (3)
   - ✅ App Role: No Access (3)

**Talking Point:**
> "And there it is! The Angular application now shows the exact same three people from APEX, with all the same filter options. The UI is modern and responsive, but the data is identical."

---

## Option B: Screenshot Method (Visual Approach)

### Step 1: Take Screenshots of APEX People (2 minutes)

1. **Open APEX People section:**
   ```
   https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/r/apexdotnet/strategic-planner/people
   ```

2. **Take a screenshot** showing:
   - Left sidebar with filters
   - All 3 people visible
   - Their emails and countries

3. **Save screenshot to:**
   ```
   /Users/commit2cloud/ApexToDotNet/screenshots/apex-people-original.png
   ```

**Talking Point:**
> "Here's our current APEX application showing three people. I'm taking a screenshot so we can compare it side-by-side with the Angular version."

---

### Step 2: Manually Create People Data (2 minutes)

Based on what you see in APEX, create this data structure:

1. **Open the People Service:**
   ```bash
   code /Users/commit2cloud/ApexToDotNet/ApexToDotNet.Web/src/app/services/strategic-planner.service.ts
   ```

2. **Find `getPeople()` method and replace with:**

```typescript
getPeople(): Observable<any[]> {
  // Data synced from APEX - Screenshot: apex-people-original.png
  const people = [
    {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@acme.com',
      country: 'United States',
      emailDomain: 'acme.com',
      phoneNumber: '+1-555-0101',
      hasScreenName: false,
      appRole: 'No Access',
      tags: [],
      competencies: []
    },
    {
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      country: 'United States',
      emailDomain: 'acme.com',
      phoneNumber: '+1-555-0102',
      hasScreenName: false,
      appRole: 'No Access',
      tags: [],
      competencies: []
    },
    {
      id: 3,
      firstName: 'Scott',
      lastName: 'Tiger',
      email: 'scott.tiger@acme.com',
      country: 'United States',
      emailDomain: 'acme.com',
      phoneNumber: '+1-555-0103',
      hasScreenName: false,
      appRole: 'No Access',
      tags: [],
      competencies: []
    }
  ];
  
  return of(people);
}
```

3. **Save the file**

**Talking Point:**
> "I'm manually entering the data from APEX into our Angular service. In production, this would be automated via ORDS REST APIs, but for this POC, we're demonstrating the data structure."

---

### Step 3: Take Screenshot of Angular People (1 minute)

1. **Open Angular app:** http://localhost:4200

2. **Navigate to People section**

3. **Take a screenshot** showing:
   - Same 3 people
   - Same filters
   - Modern UI design

4. **Save screenshot to:**
   ```
   /Users/commit2cloud/ApexToDotNet/screenshots/angular-people-updated.png
   ```

**Talking Point:**
> "Now let's capture the Angular version. Notice how the data is identical, but the interface is modern and responsive."

---

### Step 4: Side-by-Side Comparison (30 seconds)

1. **Open both screenshots** side by side:
   - APEX: `screenshots/apex-people-original.png`
   - Angular: `screenshots/angular-people-updated.png`

2. **Point out:**
   - ✅ Same 3 people
   - ✅ Same email addresses
   - ✅ Same countries
   - ✅ Same filters available
   - ✅ Different UI (modern vs classic APEX)

**Talking Point:**
> "Here's the side-by-side comparison. The data is identical - same people, same details, same filters. The only difference is the user interface. APEX users can continue using the familiar interface, while we gradually migrate users to the modern Angular UI."

---

## 🔄 Quick SQL Script (Alternative)

---

## 🔄 Quick SQL Script (Alternative)

If you want to quickly check the APEX data structure, run this in SQL Workshop:

```sql
-- Quick view of people in APEX
SELECT id, 
       first_name || ' ' || last_name AS "Name",
       email,
       country,
       email_domain,
       app_role
FROM people
ORDER BY id;
```

This shows you exactly what's in APEX so you can verify the Angular data matches.

---

## 🎬 Demo Talking Points

### Opening (30 seconds)
> "Today I'm showing you how we've built a modern Angular application that mirrors our APEX Strategic Planner. The data lives in APEX, but users get a modern, responsive interface."

### During Option A - SQL Method (2 minutes)
> "Watch how we can automatically sync data from APEX to Angular. This SQL script queries the APEX database and generates the exact TypeScript code we need. In production, we'll use ORDS REST APIs for real-time sync, but this demonstrates the data flow clearly."

### During Option B - Screenshot Method (3 minutes)
> "Let me show you the APEX interface first... [take screenshot] ...and now the Angular version... [take screenshot]. Notice how the data is identical - same people, same details, same filtering capabilities - but the UI is modern and mobile-responsive."

### Closing (30 seconds)
> "This demonstrates our migration strategy: keep APEX as the data source while progressively modernizing the UI. IT continues using familiar APEX tools, while end users get a modern experience. Eventually, we'll connect via ORDS for real-time sync."

---

## 📊 What This Demo Proves

After this demo, you've shown:
- ✅ APEX data can be instantly mirrored in Angular
- ✅ No data loss during migration
- ✅ Filters and functionality work the same way
- ✅ Modern UI without sacrificing familiar workflows
- ✅ Clear, achievable migration path

---

## 🆘 Troubleshooting

### Issue: SQL script returns no data
**Solution**: 
```sql
-- Check if people table exists
SELECT table_name FROM user_tables WHERE table_name = 'PEOPLE';

-- Check if data exists
SELECT COUNT(*) FROM people;
```

### Issue: Angular not updating after paste
**Solution**: 
1. Make sure you saved the file (Cmd+S / Ctrl+S)
2. Check browser console for errors (F12)
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Make sure Angular server is running

### Issue: Can't access APEX
**Solution**: Check your credentials:
- Workspace: `APEXDOTNET`
- URL: `https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apex`

### Issue: Screenshots don't match
**Solution**: 
1. Make sure you're viewing the correct APEX page
2. Check that all 3 people are visible
3. Expand filters on left side if collapsed

---

## 📁 Demo Files

All files for this demo:
- **This script**: `DEMO_ADD_PEOPLE.md`
- **SQL sync script**: `apex-exports/sync-people-to-angular.sql`
- **Angular service**: `ApexToDotNet.Web/src/app/services/strategic-planner.service.ts`
- **Screenshots folder**: `screenshots/` (create if needed)

### Create Screenshots Folder (if needed):
```bash
mkdir -p /Users/commit2cloud/ApexToDotNet/screenshots
```

---

## ✅ Demo Checklist

Print this and check off during your demo:

**Setup:**
- [ ] APEX app accessible
- [ ] Angular app running (http://localhost:4200)
- [ ] .NET API running (http://localhost:5000)
- [ ] Screenshots folder created (if using Option B)

**Option A - SQL Method:**
- [ ] Opened APEX People section
- [ ] Showed 3 people in APEX
- [ ] Ran SQL sync script
- [ ] Copied generated TypeScript
- [ ] Pasted into Angular service
- [ ] Saved file and showed auto-reload
- [ ] Verified people in Angular UI
- [ ] Showed filters work (Country, Email Domain)

**Option B - Screenshot Method:**
- [ ] Opened APEX People section
- [ ] Took screenshot of APEX
- [ ] Updated Angular service manually
- [ ] Took screenshot of Angular
- [ ] Showed side-by-side comparison
- [ ] Verified data matches exactly

**Wrap-up:**
- [ ] Explained future ORDS integration
- [ ] Answered questions
- [ ] Provided follow-up documentation

---

## 🔮 Future Enhancement: ORDS Real-Time Sync

**What we're building toward:**

Instead of manual sync, the Angular app will:
1. ✅ Call ORDS REST endpoints automatically
2. ✅ Get real-time data from APEX tables
3. ✅ No manual copy/paste needed
4. ✅ Changes in APEX appear instantly in Angular
5. ✅ Two-way sync possible (Angular → APEX)

**Current State**: Manual sync (perfect for POC/demo)  
**Future State**: Real-time ORDS integration (production-ready)

**Next Steps**: See `ORDS_ENDPOINTS_GUIDE.md` for implementation

---

**Demo Duration**: 
- Option A (SQL): ~3 minutes  
- Option B (Screenshot): ~5 minutes

**Difficulty**: Easy  
**Impact**: High - Shows clear migration value  
**Best For**: Customer presentations, stakeholder demos

Good luck with your demo! 🚀

---

## 📸 Example Screenshots to Take

If using Option B, capture these views:

### APEX Screenshot (`apex-people-original.png`):
- Full left navigation visible
- Filters panel expanded
- All 3 people visible in main area
- Email addresses visible
- Country information showing

### Angular Screenshot (`angular-people-updated.png`):
- Left navigation visible
- People section selected
- All 3 people displayed
- Modern card/list layout
- Filters showing same options
- Responsive design evident

### Side-by-Side Comparison:
Open both screenshots in Preview or image viewer to show:
- Data consistency
- UI modernization
- Feature parity

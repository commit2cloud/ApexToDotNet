# Step 2: Create Your Task Manager Application

**You've completed**: ✅ Database table created with sample data  
**Next step**: Create the APEX application

---

## 🎨 Create the Application (5 minutes)

### Follow These Steps:

1. **Navigate to App Builder**
   - From your apexdotnet workspace home
   - Click: **App Builder** (in the top menu bar)

2. **Start Creating New App**
   - Click the blue **"Create"** button
   - Choose: **"New Application"**

3. **Name Your Application**
   - **Name**: `Task Manager`
   - Click: **"Create Application"** button
   - You'll see the Application wizard

4. **Add the Tasks Report Page**
   - Click: **"Add Page"** button
   - Choose: **"Interactive Report"**
   
   In the dialog that appears:
   - **Page Name**: `Tasks`
   - **Table or View**: Start typing "TASKS" and select your **TASKS** table
   - ☑️ **Check the box**: "Include Form Page"
   - Click: **"Add Page"**

5. **Review Your Pages**
   You should now see:
   - Home (Page 1) - Already there
   - Tasks (Page 2) - Interactive Report
   - Task (Page 3) - Form

6. **Optional Features** (You can check these):
   - ☑️ **About Page** - Adds an about page
   - ☑️ **Access Control** - User management (optional)

7. **Create the Application**
   - Click the blue **"Create Application"** button at the top right
   - Wait 20-30 seconds while APEX generates your app
   - You'll see "Application created successfully"

✅ **Your application is now created!**

---

## 🚀 Step 3: Run and Test Your Application (5 minutes)

### Run the Application

1. **Click the Run Button**
   - You'll see a **"Run Application"** button (looks like a play ▶️ icon)
   - Click it!

2. **Login** (if prompted)
   - Username: Your APEX username
   - Password: Your password
   - This opens your application in a new tab

3. **You'll See the Home Page**
   - A welcome screen with your application name
   - A navigation menu on the left

---

## 🧪 Test All Features

### Test 1: View the Task List

1. **Click "Tasks"** in the left navigation menu
2. You should see your 3 sample tasks in an Interactive Report
3. Notice these features:
   - **Search box** (top right)
   - **Column headers** (click to sort)
   - **Actions menu** (powerful filtering options)
   - **Edit icons** (pencil) next to each task
   - **Create button** (top right)

### Test 2: Create a New Task

1. **Click the "Create" button**
2. Fill in the form:
   - **Task Title**: `Build Angular Component`
   - **Task Description**: `Create the task list component in Angular`
   - **Status**: `Pending`
   - **Priority**: `High`
   - **Due Date**: Pick a date in the future
3. **Click "Create"** button
4. You should be redirected back to the task list
5. **Your new task** should appear in the list!

### Test 3: Edit a Task

1. **Click the edit icon** (pencil) on any task
2. Change the **Status** to `Complete`
3. **Click "Apply Changes"**
4. You're back at the task list
5. Notice the status has changed!

### Test 4: Try the Search

1. In the **search box** (top right), type `APEX`
2. Press Enter
3. Only tasks with "APEX" in them show up
4. Clear the search to see all tasks

### Test 5: Try Filtering

1. Click the **Actions** button (hamburger menu ≡)
2. Choose **Filter**
3. Add a filter:
   - **Column**: Status
   - **Operator**: =
   - **Value**: `Pending`
4. Click **Apply**
5. Only pending tasks show up!

### Test 6: Try Download

1. Click **Actions** → **Download**
2. Choose format (CSV, HTML, Excel, PDF)
3. Your task list downloads!

### Test 7: Delete a Task

1. Click the **edit icon** on a task
2. Scroll down and click **Delete**
3. Confirm the deletion
4. Task is removed!

---

## 🎉 Congratulations!

You've just built and tested a complete CRUD application in APEX!

**What you have now:**
- ✅ Working task list with search and filters
- ✅ Create new tasks with a form
- ✅ Edit existing tasks
- ✅ Delete tasks
- ✅ Interactive report with sorting
- ✅ Export capabilities
- ✅ All without writing any code!

---

## 🎨 Optional Enhancements (15 minutes)

Want to make it even better? Try these:

### Enhancement 1: Add a Chart to Home Page (5 min)

1. **Go back to App Builder**
   - Click on "Application XXXX" in the top left (or use browser back)
   
2. **Edit Page 1 (Home)**
   - Click on **Page 1**
   - This opens the Page Designer

3. **Add a Chart Region**
   - In the left panel, right-click **"Content Body"**
   - Choose **"Create Region"**

4. **Configure the Chart**
   - **Title**: `Tasks by Status`
   - **Type**: Change to `Chart`
   - **Chart Type**: `Pie`

5. **Set the Data Source**
   - In the right panel, find **Source**
   - **Type**: `SQL Query`
   - **SQL Query**:
   ```sql
   SELECT status as label, 
          COUNT(*) as value
   FROM tasks
   GROUP BY status
   ```

6. **Configure Series**
   - In right panel, find **Series** section
   - **Label**: `LABEL`
   - **Value**: `VALUE`

7. **Save and Run**
   - Click **Save** (top right)
   - Click **Run** to see your chart!

✅ **You now have a dashboard with a pie chart!**

### Enhancement 2: Add Due Date Validation (5 min)

Let's prevent users from creating tasks with past due dates.

1. **Go to the Form Page (Page 3)**
   - App Builder → Task Manager → Page 3

2. **Add a Validation**
   - In left sidebar, find **"Processing"** section
   - Find **"Validations"** (under Processing)
   - Right-click **Validations** → **Create Validation**

3. **Configure the Validation**
   - **Name**: `Due Date Must Be Future`
   - **Type**: `PL/SQL Function (returning Error Text)`
   - **PL/SQL Function Body**:
   ```sql
   BEGIN
       IF :P3_DUE_DATE IS NOT NULL AND :P3_DUE_DATE < TRUNC(SYSDATE) THEN
           RETURN 'Due date must be today or in the future';
       END IF;
       RETURN NULL;
   END;
   ```
   - **Associated Item**: Select `P3_DUE_DATE`

4. **Save and Test**
   - Click **Save**
   - Click **Run**
   - Try creating a task with yesterday's date
   - You should see the error message!

✅ **Validation working!**

---

## 📝 What You've Learned

**APEX Concepts:**
- ✅ Interactive Reports - powerful data grids
- ✅ Forms - auto-generated from tables
- ✅ Navigation - automatic menu generation
- ✅ CRUD operations - without writing code
- ✅ Validations - business rule enforcement
- ✅ Charts - data visualization
- ✅ Page Designer - visual development tool

**Development Speed:**
- Database table: 2 minutes
- Application creation: 5 minutes
- Testing: 5 minutes
- Enhancements: 10 minutes
- **Total: 22 minutes for a full app!**

---

## 🎯 Next Steps

### 1. Export Your Application (2 min)

Save your work!

1. **Go to App Builder**
2. Click on your **Task Manager** application
3. Click **Export/Import** (top menu)
4. Click **Export**
5. Click the **Export** button
6. Save the file: `task-manager-v1.sql`

This file contains your entire application!

### 2. Document Your Application (30-60 min)

Create: `workflows/workflow-inventory-task-manager.md`

Use the template from `WORKSPACE_SETUP_apexdotnet.md` to document:

**Workflow 1: Create New Task**
- Pages involved: Home → Tasks → Create Form
- Data: TASKS table (INSERT)
- Validations: Due date check
- User flow: Fill form → Submit → See in list

**Workflow 2: View Task List**
- Pages involved: Tasks (Interactive Report)
- Data: TASKS table (SELECT)
- Features: Search, filter, sort, export
- User flow: Navigate to Tasks → Browse → Filter/Search

**Workflow 3: Edit Task**
- Pages involved: Tasks → Edit Form
- Data: TASKS table (UPDATE)
- User flow: Click edit → Change values → Save

### 3. Design the .NET API (30 min)

Create: `api-designs/task-manager-api-design.md`

**Endpoints needed:**
```
GET    /api/tasks              - List all tasks
GET    /api/tasks/{id}         - Get single task
POST   /api/tasks              - Create new task
PUT    /api/tasks/{id}         - Update task
DELETE /api/tasks/{id}         - Delete task
GET    /api/tasks/stats        - Get statistics for chart
```

**Models needed:**
- TaskDto
- CreateTaskRequest
- UpdateTaskRequest
- TaskStatsDto

### 4. Compare Development Time

| Activity | APEX | .NET + Angular |
|----------|------|----------------|
| Create table | 2 min | 5 min (EF Migration) |
| Create list view | Wizard (2 min) | Component + Service (30 min) |
| Create form | Wizard (2 min) | Reactive Form (30 min) |
| Add validation | 5 min | C# + Angular (15 min) |
| Add chart | 5 min | Chart.js (20 min) |
| **Total** | **~20 min** | **~2-3 hours** |

**Key Insight**: APEX is 6-9x faster for CRUD applications!

---

## 🏆 Challenge: Add More Features

Try adding these yourself:

1. **Add "Completed Date" field**
   - Modify table (ALTER TABLE)
   - Add to form
   - Auto-populate when status = 'Complete'

2. **Add another chart**
   - Tasks by Priority (bar chart)
   - Overdue tasks count

3. **Add a report**
   - Overdue tasks report
   - Filter: due_date < SYSDATE and status != 'Complete'

4. **Add email notification**
   - When task is created
   - Use APEX_MAIL

---

## ✅ Summary

**You've accomplished:**
- ✅ Created a database table
- ✅ Built a complete CRUD application
- ✅ Added business logic (validations)
- ✅ Created a dashboard with charts
- ✅ Tested all features
- ✅ Experienced APEX development workflow

**Now you understand:**
- How APEX applications are built
- What makes APEX fast for CRUD apps
- What you'll be migrating to .NET
- The patterns and features in APEX
- Business logic locations

---

## 📞 Need Help?

**Common Issues:**

**Q: Can't find my TASKS table in the wizard?**
A: Make sure you're in the same workspace (apexdotnet) where you created the table.

**Q: Page Designer looks confusing?**
A: Left panel = structure, Center = visual, Right = properties. Takes 5 min to get used to!

**Q: Validation not working?**
A: Make sure the Associated Item is set to P3_DUE_DATE and the page number is correct.

**Q: Chart not showing data?**
A: Check that your SQL query returns columns named exactly "label" and "value".

---

🎉 **Congratulations! You've built your first APEX application!** 🎉

**What's next?**
- Document it in `workflows/`
- Design the .NET equivalent
- Read the migration guide with this context
- Try the challenge features!

Let me know when you've completed the app and I'll help you document it! 🚀

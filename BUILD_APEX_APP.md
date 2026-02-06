# Building Your First APEX App - "Task Manager"

**Workspace**: apexdotnet  
**Project**: Simple Task Manager Application  
**Time**: 30-45 minutes

---

## 🎯 What We'll Build

A simple **Task Manager** with:
- ✅ List of tasks (Interactive Report)
- ✅ Create new task (Form)
- ✅ Edit existing task (Form)
- ✅ Delete task
- ✅ Mark as complete/incomplete
- ✅ Filter by status

This will teach you:
- APEX page types
- Data modeling
- Business logic
- Validations
- Navigation
- Interactive components

---

## 📋 Step-by-Step Instructions

### STEP 1: Create the Database Table (5 min)

1. **Login to apex.oracle.com**
   - Select workspace: **apexdotnet**

2. **Go to SQL Workshop**
   - Click: **SQL Workshop** → **SQL Commands**

3. **Create the TASKS table**
   - Copy and paste this SQL:

```sql
-- Create the TASKS table
CREATE TABLE tasks (
    task_id         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_title      VARCHAR2(200) NOT NULL,
    task_description VARCHAR2(4000),
    status          VARCHAR2(20) DEFAULT 'Pending' NOT NULL 
                    CHECK (status IN ('Pending', 'In Progress', 'Complete')),
    priority        VARCHAR2(20) DEFAULT 'Medium'
                    CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    due_date        DATE,
    created_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by      VARCHAR2(100) DEFAULT USER NOT NULL,
    modified_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by     VARCHAR2(100) DEFAULT USER NOT NULL
);

-- Create index for better performance
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX tasks_due_date_idx ON tasks(due_date);

-- Insert sample data
INSERT INTO tasks (task_title, task_description, status, priority, due_date) 
VALUES ('Learn APEX', 'Complete APEX tutorial and build sample app', 'In Progress', 'High', SYSDATE + 7);

INSERT INTO tasks (task_title, task_description, status, priority, due_date) 
VALUES ('Document Workflow', 'Create workflow inventory document', 'Pending', 'High', SYSDATE + 3);

INSERT INTO tasks (task_title, task_description, status, priority, due_date) 
VALUES ('Setup .NET Environment', 'Install .NET SDK and create project', 'Pending', 'Medium', SYSDATE + 14);

INSERT INTO tasks (task_title, task_description, status, priority, due_date) 
VALUES ('Read Migration Guide', 'Study the 10-step migration approach', 'In Progress', 'High', SYSDATE + 5);

INSERT INTO tasks (task_title, task_description, status, priority, due_date) 
VALUES ('Test APEX Features', 'Explore Interactive Reports and Forms', 'Complete', 'Medium', SYSDATE - 2);

COMMIT;
```

4. **Click: Run** (or press Ctrl+Enter)
5. **Verify**: You should see "Table created" and "5 rows inserted"

6. **Query the data** to confirm:
```sql
SELECT * FROM tasks ORDER BY created_date DESC;
```

✅ **You now have a database table with sample data!**

---

### STEP 2: Create the Application (5 min)

1. **Go to App Builder**
   - Click: **App Builder** (top menu)

2. **Create New Application**
   - Click: **Create** button
   - Choose: **New Application**

3. **Name your application**
   - Name: **Task Manager**
   - Click: **Create Application**

4. **Add Pages** (Application Wizard):
   
   **Keep the default "Home" page, then add:**
   
   - Click: **Add Page**
   - Choose: **Interactive Report**
   - Page Name: **Tasks**
   - Table/View: **TASKS**
   - Check: ☑️ Include Form Page
   - Click: **Add Page**

5. **Features** (optional but recommended):
   - ☑️ Check: **About Page**
   - ☑️ Check: **Access Control**

6. **Click: Create Application**

7. **Wait** (30 seconds) for APEX to generate the app

✅ **Your application is created!**

---

### STEP 3: Run and Test the Application (5 min)

1. **Click: Run Application** (play button icon)

2. **Login** (if prompted):
   - Username: Your APEX username
   - Password: Your password

3. **Explore the Home Page**
   - You'll see a dashboard
   - Navigate using the menu

4. **Click: Tasks** (in the navigation menu)
   - You'll see the Interactive Report with your 5 sample tasks
   - Try these features:
     - Search box (top right)
     - Column sorting (click column headers)
     - Filter (Actions menu)
     - Download (Actions menu)

5. **Create a New Task**
   - Click: **Create** button
   - Fill in:
     - Task Title: "Build Angular Component"
     - Description: "Create task list component in Angular"
     - Status: Pending
     - Priority: High
     - Due Date: (pick a date)
   - Click: **Create**

6. **Edit a Task**
   - Click the edit icon (pencil) on any task
   - Change the status to "Complete"
   - Click: **Apply Changes**

7. **Delete a Task**
   - Click the edit icon
   - Click: **Delete**
   - Confirm deletion

✅ **You've used all CRUD operations!**

---

### STEP 4: Customize the Application (10 min)

Now let's add some business logic and customizations.

#### A. Add a Validation (Ensure due date is in future)

1. **Go back to App Builder**
   - Click: **Application [number]** (top left or use browser back)
   - OR go to apex.oracle.com → App Builder → Task Manager

2. **Edit the Form Page**
   - Click on page: **Task** (usually page 3 or 4)
   - This opens Page Designer

3. **Add a Validation**
   - In left sidebar: **Validations** section (under Processing)
   - Right-click: **Validations** → **Create Validation**
   - Or click the **+** icon next to Validations

4. **Configure the Validation**:
   - **Name**: `Due Date Must Be Future`
   - **Type**: `PL/SQL Function (returning Error Text)`
   - **PL/SQL Function Body**:
   ```sql
   BEGIN
       IF :P3_DUE_DATE < TRUNC(SYSDATE) THEN
           RETURN 'Due date must be today or in the future';
       END IF;
       RETURN NULL;
   END;
   ```
   - **Error Message**: Leave blank (returned from function)
   - **Associated Item**: `P3_DUE_DATE`

5. **Save** (top right)

#### B. Add a Computed Field (Days Until Due)

1. **In the same Form Page** (still in Page Designer)

2. **Add a Display-Only Item**:
   - In center panel: **Find the region** (usually called "Task")
   - Right-click the region → **Create Page Item**
   - **Name**: `P3_DAYS_UNTIL_DUE`
   - **Type**: `Display Only`
   - **Label**: `Days Until Due`
   - **Position**: After `P3_DUE_DATE`

3. **Add Computation** for this item:
   - In left sidebar: **Pre-Rendering** → **Computations**
   - Right-click **Computations** → **Create Computation**
   - **Item**: `P3_DAYS_UNTIL_DUE`
   - **Type**: `SQL Query (return single value)`
   - **SQL Query**:
   ```sql
   SELECT CASE 
       WHEN :P3_DUE_DATE IS NULL THEN 'No due date set'
       WHEN :P3_DUE_DATE < TRUNC(SYSDATE) THEN 'Overdue by ' || (TRUNC(SYSDATE) - :P3_DUE_DATE) || ' days'
       WHEN :P3_DUE_DATE = TRUNC(SYSDATE) THEN 'Due today'
       ELSE 'Due in ' || (:P3_DUE_DATE - TRUNC(SYSDATE)) || ' days'
   END
   FROM dual
   ```

4. **Save**

#### C. Add a Badge to Show Task Count

1. **Go to the Tasks Report Page** (usually page 2)
   - Click: Page 2 in Page Designer (or go back and select it)

2. **Find the Interactive Report region**

3. **Add a Badge**:
   - In the region properties (right panel)
   - **Badge**:
     - **Value**: 
     ```sql
     SELECT COUNT(*) FROM tasks WHERE status != 'Complete'
     ```
     - **Label**: `Open Tasks`

4. **Save**

#### D. Add Status Color Coding

1. **Still in the Tasks Report Page** (Page 2)

2. **Find the STATUS column** (in the region's columns list)

3. **Add conditional display**:
   - Click on the **STATUS** column
   - In properties (right panel):
   - **Appearance** → **Template**: `Badge`
   - Scroll down to **Server-side Condition**
   - Add a **Highlight** rule:
     - Go to: **Columns** in left sidebar
     - Select: **STATUS** column
     - In properties, find: **Appearance** → **CSS Classes**
     - Add: 
     ```
     &STATUS.
     ```

   Actually, better approach - use conditional highlighting:
   
   - In the **Interactive Report** attributes (select the region)
   - Right panel → **Attributes** → **Appearance** → **Template Options**
   - Enable: **Badge** for status column

5. **Save and Run**

---

### STEP 5: Add a Chart (5 min)

Let's add a visual dashboard!

1. **Go to Home Page** (Page 1)

2. **Add a Chart Region**:
   - In Page Designer for Page 1
   - Right-click: **Content Body** → **Create Region**
   - **Title**: `Tasks by Status`
   - **Type**: `Chart`

3. **Configure the Chart**:
   - **Chart Type**: `Pie`
   - **Source** → **SQL Query**:
   ```sql
   SELECT status as label,
          COUNT(*) as value
   FROM tasks
   GROUP BY status
   ORDER BY status
   ```
   - **Series**:
     - **Label**: `LABEL`
     - **Value**: `VALUE`

4. **Another Chart** (optional):
   - Create another region: `Tasks by Priority`
   - Chart Type: `Bar`
   - SQL:
   ```sql
   SELECT priority as label,
          COUNT(*) as value
   FROM tasks
   GROUP BY priority
   ORDER BY DECODE(priority, 'Urgent', 1, 'High', 2, 'Medium', 3, 'Low', 4)
   ```

5. **Save and Run**

✅ **You now have a dashboard!**

---

### STEP 6: Test Everything (5 min)

1. **Run the Application**

2. **Test the Home Page**:
   - View your charts
   - Should show task distribution by status and priority

3. **Test the Tasks Page**:
   - View the badge showing open task count
   - Use search and filters
   - Sort by different columns

4. **Test Creating a Task**:
   - Click: **Create**
   - Try to set a past due date → Should see validation error
   - Set a future due date → Should work
   - Notice "Days Until Due" calculation

5. **Test Editing**:
   - Edit a task and change status
   - See the home page charts update

6. **Test the Interactive Report Actions**:
   - Click: **Actions** menu
   - Try: **Filter** → Add a filter (status = 'Pending')
   - Try: **Download** → Download as CSV
   - Try: **Save Report** → Save your customized view

✅ **Full application working!**

---

## 📝 What You've Learned

### APEX Concepts Covered:
1. ✅ **Database Tables**: Created with constraints and indexes
2. ✅ **Application**: Created from wizard
3. ✅ **Interactive Report**: List view with search, filter, sort
4. ✅ **Form**: Create/Edit with master-detail pattern
5. ✅ **Validations**: Business rules (due date check)
6. ✅ **Computations**: Calculated fields (days until due)
7. ✅ **Charts**: Visual data representation
8. ✅ **SQL**: Queries for data retrieval and calculations
9. ✅ **Navigation**: Menu and page linking
10. ✅ **CRUD Operations**: Create, Read, Update, Delete

### Key APEX Features:
- 📊 **Interactive Reports**: Powerful, user-customizable tables
- 📝 **Forms**: Auto-generated from table structure
- ✅ **Validations**: Client and server-side rules
- 🎨 **Charts**: Built-in visualization
- 🔐 **Security**: Built-in authentication
- 📱 **Responsive**: Works on mobile automatically

---

## 🎯 Next: Document This Application

Now that you've built it, document it as a workflow inventory!

Create: `workflows/workflow-inventory-task-manager.md`

**Document:**
1. **Workflow**: Create a Task
   - Pages: Home → Tasks → Create Form
   - Data: TASKS table
   - Logic: Due date validation, days calculation
   - UI: Form fields, buttons

2. **Workflow**: View and Filter Tasks
   - Pages: Tasks list (Interactive Report)
   - Data: TASKS table
   - Logic: Filtering, sorting, searching
   - UI: Actions menu, column headers, search box

3. **Workflow**: Edit Task Status
   - Pages: Tasks list → Edit form
   - Data: TASKS table (UPDATE)
   - Logic: Status change, modified date update
   - UI: Edit icon, form, Apply Changes button

**Then design the .NET API** for this:
```
GET    /api/tasks              - List all tasks
GET    /api/tasks/{id}         - Get single task
POST   /api/tasks              - Create new task
PUT    /api/tasks/{id}         - Update task
DELETE /api/tasks/{id}         - Delete task
GET    /api/tasks/stats        - Get task statistics for charts
```

---

## 🏆 Challenge: Add More Features

Try adding these yourself:

1. **Add a "Completed Date" field**
   - Auto-populate when status changes to "Complete"

2. **Add "Assigned To" field**
   - Create a USERS table
   - Add foreign key to TASKS

3. **Add Categories/Tags**
   - Create CATEGORIES table
   - Many-to-many relationship

4. **Add Email Notifications**
   - When task is created
   - When due date is approaching

5. **Add Comments**
   - Create TASK_COMMENTS table
   - Add comments region to form page

---

## 📊 Compare APEX vs .NET

| Feature | APEX | .NET + Angular |
|---------|------|----------------|
| **Create Table** | SQL Script | EF Core Migration |
| **Create Form** | Wizard (2 min) | Controller + Component (30 min) |
| **Validation** | PL/SQL Function | C# Service + Angular Validators |
| **Report** | Interactive Report | AG-Grid or Material Table |
| **Charts** | Built-in Chart Region | Chart.js or D3.js |
| **Navigation** | Automatic Menu | Angular Router |
| **Security** | Built-in Auth | JWT + Identity |
| **Total Time** | 45 minutes | 4-8 hours |

**Key Insight**: APEX is FAST for CRUD apps. .NET gives you more control and flexibility.

---

## 💾 Export Your Application

To save your work:

1. **Go to App Builder**
2. **Click: Your application**
3. **Click: Export/Import**
4. **Click: Export**
5. **Click: Export** button
6. **Save the file**: `task-manager-app.sql`

This file contains your entire application and can be:
- Version controlled
- Imported to other workspaces
- Used as documentation
- Analyzed for migration planning

---

## 🎓 What You've Accomplished

✅ Created a full CRUD application  
✅ Implemented business logic  
✅ Added validations and computations  
✅ Created interactive reports  
✅ Built charts and dashboards  
✅ Tested all functionality  
✅ Experienced the APEX development workflow  

**Now you understand what you'll be migrating to .NET!**

---

## ⏭️ Next Steps

1. ✅ Export your application
2. ✅ Document it as workflow inventories
3. ✅ Design the equivalent .NET APIs
4. ✅ Plan the Angular components
5. ✅ Read the migration guide with this context

---

**Great job! You now have hands-on APEX experience.** 🎉

**Questions? Try adding more features or start documenting this app!**

# Quick Start: Build Task Manager in APEX

**Time**: 30 minutes  
**Workspace**: apexdotnet

---

## 🚀 3 Simple Steps

### 1️⃣ Create Database Table (5 min)

1. Login to apex.oracle.com → workspace: **apexdotnet**
2. Click: **SQL Workshop** → **SQL Commands**
3. Paste this SQL and click **Run**:

```sql
CREATE TABLE tasks (
    task_id         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_title      VARCHAR2(200) NOT NULL,
    task_description VARCHAR2(4000),
    status          VARCHAR2(20) DEFAULT 'Pending' NOT NULL,
    priority        VARCHAR2(20) DEFAULT 'Medium',
    due_date        DATE,
    created_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert sample data
INSERT INTO tasks (task_title, status, priority, due_date) 
VALUES ('Learn APEX', 'In Progress', 'High', SYSDATE + 7);
INSERT INTO tasks (task_title, status, priority, due_date) 
VALUES ('Document Workflow', 'Pending', 'High', SYSDATE + 3);
INSERT INTO tasks (task_title, status, priority, due_date) 
VALUES ('Build .NET API', 'Pending', 'Medium', SYSDATE + 14);
COMMIT;

-- Verify
SELECT * FROM tasks;
```

✅ Table created with sample data!

---

### 2️⃣ Create Application (5 min)

1. Click: **App Builder** → **Create** → **New Application**
2. Name: **Task Manager**
3. Click: **Add Page** → **Interactive Report**
   - Page Name: **Tasks**
   - Table: **TASKS**
   - ☑️ Check: **Include Form Page**
   - Click: **Add Page**
4. Click: **Create Application**
5. Wait 30 seconds...

✅ Application created!

---

### 3️⃣ Run and Test (5 min)

1. Click: **Run Application** (play button)
2. Login with your credentials
3. Click: **Tasks** in menu
4. Click: **Create** → Fill in a new task → **Create**
5. Click edit icon (pencil) → Change status → **Apply Changes**

✅ Working CRUD application!

---

## 🎨 Make It Better (15 min)

### Add a Chart to Home Page

1. **App Builder** → **Task Manager** → **Page 1 (Home)**
2. **Right-click Content Body** → **Create Region**
3. **Title**: `Tasks by Status`
4. **Type**: `Chart` → **Pie**
5. **Source**:
```sql
SELECT status as label, COUNT(*) as value
FROM tasks
GROUP BY status
```
6. **Save** → **Run**

✅ Dashboard with chart!

### Add Due Date Validation

1. **Page 3 (Form)** → **Validations** → **Create**
2. **Name**: `Due Date Must Be Future`
3. **Type**: `PL/SQL Function`
4. **Code**:
```sql
BEGIN
    IF :P3_DUE_DATE < TRUNC(SYSDATE) THEN
        RETURN 'Due date must be today or later';
    END IF;
    RETURN NULL;
END;
```
5. **Save** → **Run**

✅ Validation working!

---

## 📝 Test Your App

Try these:
- ✅ Create 3 tasks with different priorities
- ✅ Try to create task with past due date → See error
- ✅ Edit a task and mark it Complete
- ✅ Use search box in task list
- ✅ Try Actions → Filter → Status = 'Pending'
- ✅ Try Actions → Download → CSV
- ✅ View home page chart

---

## 🎯 Next: Document It

Create: `workflows/workflow-inventory-task-manager.md`

Document these workflows:
1. Create Task
2. View Task List
3. Edit Task
4. Complete Task

Use the template in: `WORKSPACE_SETUP_apexdotnet.md`

---

## 💡 What You Learned

✅ APEX can build apps in 30 minutes  
✅ Interactive Reports are powerful  
✅ Forms auto-generate from tables  
✅ Validations in PL/SQL  
✅ Charts from SQL queries  
✅ Full CRUD without code  

**Now you know what you're migrating!**

---

See **BUILD_APEX_APP.md** for detailed step-by-step.

🚀 Ready to build? Go to apex.oracle.com!

# ORDS Endpoints Setup Guide

## 🎯 Overview

This guide shows you how to create REST API endpoints in Oracle APEX using ORDS (Oracle REST Data Services). These endpoints will be called by your .NET API to fetch and update data.

## 📍 Access ORDS Setup

1. Login to your APEX workspace: https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords
2. Navigate to **SQL Workshop → RESTful Services**

## 🛠️ Creating REST Endpoints

### Step 1: Create Module

1. Click **"Modules"** in the left sidebar
2. Click **"Create Module"**
3. Enter:
   - **Module Name**: `api`
   - **Base Path**: `/api/`
   - **Protected by Privilege**: Leave unchecked (or add authentication later)
4. Click **"Create Module"**

### Step 2: Create Templates and Handlers

Now create endpoints for each entity...

---

## 📋 Projects Endpoints

### GET /api/projects (List All Projects)

**Template**: `/projects/`
**Handler**: GET
**Source Type**: Query
**SQL**:
```sql
SELECT 
    p.id,
    p.name,
    p.description,
    p.priority,
    p.status,
    p.start_date as "startDate",
    p.end_date as "endDate",
    p.area_id as "areaId",
    a.name as "areaName",
    p.initiative_id as "initiativeId",
    i.name as "initiativeName",
    (SELECT COUNT(*) FROM project_people pp WHERE pp.project_id = p.id) as "personCount",
    (SELECT COUNT(*) FROM activities act WHERE act.project_id = p.id) as "activityCount",
    p.created_date as "createdDate",
    p.updated_date as "updatedDate"
FROM projects p
LEFT JOIN areas a ON p.area_id = a.id
LEFT JOIN initiatives i ON p.initiative_id = i.id
WHERE 
    (:area_id IS NULL OR p.area_id = :area_id)
    AND (:priority IS NULL OR p.priority = :priority)
    AND (:status IS NULL OR p.status = :status)
ORDER BY p.priority, p.updated_date DESC
OFFSET :page * :limit ROWS
FETCH NEXT :limit ROWS ONLY
```

**Parameters**:
- `area_id` - Number (optional)
- `priority` - Number (optional)
- `status` - String (optional)
- `page` - Number (default: 0)
- `limit` - Number (default: 50)

---

### GET /api/projects/:id (Get Single Project)

**Template**: `/projects/:id`
**Handler**: GET
**Source Type**: Query
**SQL**:
```sql
SELECT 
    p.id,
    p.name,
    p.description,
    p.priority,
    p.status,
    p.start_date as "startDate",
    p.end_date as "endDate",
    p.area_id as "areaId",
    a.name as "areaName",
    p.initiative_id as "initiativeId",
    i.name as "initiativeName",
    (SELECT COUNT(*) FROM project_people pp WHERE pp.project_id = p.id) as "personCount",
    (SELECT COUNT(*) FROM activities act WHERE act.project_id = p.id) as "activityCount",
    p.created_date as "createdDate",
    p.updated_date as "updatedDate"
FROM projects p
LEFT JOIN areas a ON p.area_id = a.id
LEFT JOIN initiatives i ON p.initiative_id = i.id
WHERE p.id = :id
```

**Parameters**:
- `id` - Number (from URL path)

---

### POST /api/projects (Create Project)

**Template**: `/projects/`
**Handler**: POST
**Source Type**: PL/SQL
**SQL**:
```sql
DECLARE
    v_id NUMBER;
BEGIN
    INSERT INTO projects (
        name, 
        description, 
        priority, 
        status,
        start_date,
        end_date,
        area_id,
        initiative_id,
        created_date,
        updated_date
    ) VALUES (
        :name,
        :description,
        :priority,
        :status,
        :start_date,
        :end_date,
        :area_id,
        :initiative_id,
        SYSDATE,
        SYSDATE
    ) RETURNING id INTO v_id;
    
    :status_code := 201;
    :id := v_id;
    
    COMMIT;
END;
```

**Parameters** (from JSON body):
- `name` - String
- `description` - String
- `priority` - Number
- `status` - String
- `start_date` - Date
- `end_date` - Date
- `area_id` - Number
- `initiative_id` - Number

---

### PUT /api/projects/:id (Update Project)

**Template**: `/projects/:id`
**Handler**: PUT
**Source Type**: PL/SQL
**SQL**:
```sql
BEGIN
    UPDATE projects
    SET 
        name = :name,
        description = :description,
        priority = :priority,
        status = :status,
        start_date = :start_date,
        end_date = :end_date,
        area_id = :area_id,
        initiative_id = :initiative_id,
        updated_date = SYSDATE
    WHERE id = :id;
    
    IF SQL%ROWCOUNT = 0 THEN
        :status_code := 404;
    ELSE
        :status_code := 200;
    END IF;
    
    COMMIT;
END;
```

---

### DELETE /api/projects/:id (Delete Project)

**Template**: `/projects/:id`
**Handler**: DELETE
**Source Type**: PL/SQL
**SQL**:
```sql
BEGIN
    DELETE FROM projects WHERE id = :id;
    
    IF SQL%ROWCOUNT = 0 THEN
        :status_code := 404;
    ELSE
        :status_code := 204;
    END IF;
    
    COMMIT;
END;
```

---

## 📊 Dashboard Endpoints

### GET /api/dashboard/counts (Navigation Counts)

**Template**: `/dashboard/counts`
**Handler**: GET
**Source Type**: Query
**SQL**:
```sql
SELECT 
    (SELECT COUNT(*) FROM projects) as "projects",
    (SELECT COUNT(*) FROM areas) as "areas",
    (SELECT COUNT(*) FROM initiatives) as "initiatives",
    (SELECT COUNT(*) FROM activities) as "activities",
    (SELECT COUNT(*) FROM people) as "people",
    (SELECT COUNT(*) FROM project_groups) as "projectGroups",
    (SELECT COUNT(*) FROM person_groups) as "personGroups",
    (SELECT COUNT(*) FROM releases) as "releases"
FROM dual
```

---

### GET /api/areas (List Areas)

**Template**: `/areas/`
**Handler**: GET
**Source Type**: Query
**SQL**:
```sql
SELECT 
    a.id,
    a.name,
    a.description,
    a.color,
    (SELECT COUNT(*) FROM projects p WHERE p.area_id = a.id) as "projectCount",
    (SELECT COUNT(*) FROM initiatives i WHERE i.area_id = a.id) as "initiativeCount"
FROM areas a
ORDER BY a.name
```

---

### GET /api/initiatives (List Initiatives)

**Template**: `/initiatives/`
**Handler**: GET
**Source Type**: Query
**SQL**:
```sql
SELECT 
    i.id,
    i.name,
    i.description,
    i.priority,
    i.size,
    i.area_id as "areaId",
    a.name as "areaName",
    i.start_date as "startDate",
    i.end_date as "endDate",
    (SELECT COUNT(*) FROM projects p WHERE p.initiative_id = i.id) as "projectCount",
    (SELECT COUNT(*) FROM activities act WHERE act.initiative_id = i.id) as "activityCount"
FROM initiatives i
LEFT JOIN areas a ON i.area_id = a.id
WHERE (:area_id IS NULL OR i.area_id = :area_id)
ORDER BY i.priority, i.name
```

**Parameters**:
- `area_id` - Number (optional)

---

### GET /api/activities (List Activities)

**Template**: `/activities/`
**Handler**: GET
**Source Type**: Query
**SQL**:
```sql
SELECT 
    a.id,
    a.title,
    a.description,
    a.priority,
    a.size,
    a.status,
    a.project_id as "projectId",
    p.name as "projectName",
    a.initiative_id as "initiativeId",
    i.name as "initiativeName",
    a.assigned_to_id as "assignedToId",
    person.name as "assignedToName",
    a.due_date as "dueDate",
    a.completed_date as "completedDate"
FROM activities a
LEFT JOIN projects p ON a.project_id = p.id
LEFT JOIN initiatives i ON a.initiative_id = i.id
LEFT JOIN people person ON a.assigned_to_id = person.id
WHERE 
    (:project_id IS NULL OR a.project_id = :project_id)
    AND (:status IS NULL OR a.status = :status)
ORDER BY a.priority, a.due_date
```

**Parameters**:
- `project_id` - Number (optional)
- `status` - String (optional)

---

### GET /api/people (List People)

**Template**: `/people/`
**Handler**: GET
**Source Type**: Query
**SQL**:
```sql
SELECT 
    p.id,
    p.name,
    p.email,
    p.role,
    p.department,
    (SELECT COUNT(*) FROM project_people pp WHERE pp.person_id = p.id) as "projectCount",
    (SELECT COUNT(*) FROM activities a WHERE a.assigned_to_id = p.id) as "activityCount",
    (SELECT COUNT(*) FROM activities a WHERE a.assigned_to_id = p.id AND a.status = 'Completed') as "completedActivityCount"
FROM people p
ORDER BY p.name
```

---

## 🔒 Adding Authentication (Optional)

If you want to protect your endpoints:

1. Go to **SQL Workshop → RESTful Services → Privileges**
2. Click **"Create Privilege"**
3. Name it (e.g., `api.read`)
4. In your Module, edit and select the privilege
5. Use OAuth2 or Basic Authentication

For Basic Auth (simple):
- Client will send `Authorization: Basic <base64(username:password)>`
- ORDS will validate against APEX workspace credentials

---

## ✅ Testing Your Endpoints

### Using curl:

```bash
# Test counts endpoint
curl -X GET "https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/api/dashboard/counts"

# Test projects endpoint
curl -X GET "https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/api/projects/"

# Test with auth
curl -X GET \
  -u "apexdotnet:your_password" \
  "https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/api/projects/"
```

### Using Browser:
Just visit the URL directly for GET endpoints:
```
https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/api/dashboard/counts
```

---

## 📝 Table Structures Needed

Make sure these tables exist in your APEX workspace:

```sql
-- Projects table
CREATE TABLE projects (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    description CLOB,
    priority NUMBER(1),
    status VARCHAR2(50),
    start_date DATE,
    end_date DATE,
    area_id NUMBER,
    initiative_id NUMBER,
    created_date DATE DEFAULT SYSDATE,
    updated_date DATE DEFAULT SYSDATE
);

-- Areas table
CREATE TABLE areas (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    description CLOB,
    color VARCHAR2(7)
);

-- Initiatives table
CREATE TABLE initiatives (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    description CLOB,
    priority NUMBER(1),
    size VARCHAR2(10),
    area_id NUMBER,
    start_date DATE,
    end_date DATE
);

-- Activities table
CREATE TABLE activities (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR2(200) NOT NULL,
    description CLOB,
    priority NUMBER(1),
    size VARCHAR2(10),
    status VARCHAR2(50),
    project_id NUMBER,
    initiative_id NUMBER,
    assigned_to_id NUMBER,
    due_date DATE,
    completed_date DATE
);

-- People table
CREATE TABLE people (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    email VARCHAR2(200),
    role VARCHAR2(100),
    department VARCHAR2(100)
);

-- Project-People junction table
CREATE TABLE project_people (
    project_id NUMBER,
    person_id NUMBER,
    PRIMARY KEY (project_id, person_id)
);
```

---

## 🚀 Next Steps

1. **Create the Module** in ORDS
2. **Add each Template** one by one
3. **Add Handlers** (GET/POST/PUT/DELETE) to each template
4. **Test each endpoint** with curl or browser
5. **Update passwords** in your .NET `appsettings.json` if using authentication
6. **Run your .NET API** and test the integration

---

## 🐛 Troubleshooting

**404 Not Found**
- Check the URL matches exactly: `/api/projects/` (with trailing slash)
- Verify module is enabled

**401 Unauthorized**
- Check username/password in appsettings.json
- Verify privilege settings

**500 Internal Server Error**
- Check SQL syntax in ORDS handler
- Look at ORDS logs in APEX

**Empty Results**
- Tables may be empty
- Check SQL parameters are being passed correctly

---

## 📚 Resources

- [ORDS Documentation](https://docs.oracle.com/en/database/oracle/oracle-rest-data-services/)
- [APEX RESTful Services](https://docs.oracle.com/en/database/oracle/apex/24.2/htmdb/managing-RESTful-services.html)

---

**Your ORDS Base URL**: `https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/`

Good luck! 🎉

# APEX Metadata Extraction Guide
## Proving Enterprise-Scale Migration from Oracle APEX → .NET/Angular

> **Goal**: Programmatically extract every piece of an APEX application — UI layout, business logic, navigation, validations, processes — and prove this can scale to hundreds of apps in a large enterprise.

---

## 🏗️ The 5 Extraction Methods (Best → Easiest)

| # | Method | What You Get | Enterprise Scale? |
|---|--------|-------------|-------------------|
| 1 | **APEX Dictionary Views (SQL)** | Every detail: pages, regions, items, processes, validations, LOVs, nav lists | ✅ Best — fully scriptable |
| 2 | **APEX_EXPORT PL/SQL API** | Full application export as SQL/CLOB | ✅ Automated bulk export |
| 3 | **APEX Builder REST API** | JSON metadata via HTTP | ✅ CI/CD integration |
| 4 | **SQL Developer / VS Code Extension** | GUI export with split files | ⚠️ Manual, not scalable |
| 5 | **APEX UI Export** | Single SQL file (what we have in `sampleapp.sql`) | ❌ Manual, one-at-a-time |

---

## 1️⃣ APEX Dictionary Views (SQL) — THE ENTERPRISE APPROACH

These are database views that expose **every piece of metadata** about every APEX app. Run these directly from SQL Worksheet in your APEX instance or via SQL Developer.

### Connect to Your Instance
```
APEX SQL Workshop → SQL Commands
— or —
https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/r/apexdotnet/...
```

### 1A. Discover All Apps in the Workspace
```sql
-- List all applications in your workspace
SELECT application_id, 
       application_name, 
       owner,
       pages,
       application_group,
       created_on,
       last_updated_on
FROM apex_applications
WHERE workspace = 'APEXDOTNET'
ORDER BY application_id;
```

### 1B. Extract ALL Pages (UI Layout)
```sql
-- Every page with its properties
SELECT page_id, 
       page_name, 
       page_title,
       page_mode,         -- Normal, Modal Dialog, Non-Modal Dialog
       page_group,
       page_function,
       page_template,
       page_css_classes,
       javascript_code,
       css_inline,
       page_comment,
       created_on,
       last_updated_by,
       last_updated_on
FROM apex_application_pages
WHERE application_id = 102    -- Strategic Planner
ORDER BY page_id;
```

### 1C. Extract ALL Regions (UI Components)
```sql
-- Every region on every page — this is the UI structure
SELECT page_id,
       region_id,
       region_name,
       region_position,    -- BODY, REGION_POSITION_01, etc.
       source_type,        -- Static HTML, SQL Query, PL/SQL, REST, etc.
       source_type_code,
       region_source,      -- The actual SQL query or HTML!
       template,
       display_sequence,
       display_condition_type,
       display_condition,
       region_header_text,
       region_footer_text,
       region_template_options,
       region_attributes,
       ajax_enabled,
       created_on,
       last_updated_on
FROM apex_application_page_regions
WHERE application_id = 102
ORDER BY page_id, display_sequence;
```

### 1D. Extract ALL Page Items (Form Fields, Inputs)
```sql
-- Every form field, button, text input, select list, etc.
SELECT page_id,
       item_name,
       item_id,
       display_as,         -- Text Field, Select List, Date Picker, etc.
       display_as_code,
       label,
       item_source_type,
       item_source,        -- SQL, PL/SQL, Static, Database Column
       item_default,
       item_default_type,
       format_mask,
       lov_named_lov,      -- List of Values name
       lov_definition,     -- LOV SQL query
       lov_display_extra,
       is_required,
       display_sequence,
       display_condition_type,
       display_condition,
       item_comment,
       created_on,
       last_updated_on
FROM apex_application_page_items
WHERE application_id = 102
ORDER BY page_id, display_sequence;
```

### 1E. Extract ALL Processes (Business Logic)
```sql
-- Every PL/SQL process, DML, Web Service call
SELECT page_id,
       process_name,
       process_sequence,
       process_point,       -- Before Header, After Submit, On Load, etc.
       process_point_code,
       process_type,        -- PL/SQL, DML, Web Service, etc.
       process_type_code,
       process_source,      -- THE ACTUAL PL/SQL CODE!
       process_source_type,
       process_error_message,
       process_when_button_id,
       process_when,
       process_when_type,
       process_success_message,
       process_comment,
       created_on,
       last_updated_on
FROM apex_application_page_proc
WHERE application_id = 102
ORDER BY page_id, process_sequence;
```

### 1F. Extract ALL Validations
```sql
-- Form validations, business rules
SELECT page_id,
       validation_name,
       validation_sequence,
       validation_type,          -- SQL, PL/SQL, Item comparison, Regular Expression
       validation_type_code,
       validation_expression1,   -- The actual validation code
       validation_expression2,
       error_message,
       error_display_location,
       associated_item,
       when_button_pressed,
       condition_type,
       condition_expression1,
       created_on,
       last_updated_on
FROM apex_application_page_val
WHERE application_id = 102
ORDER BY page_id, validation_sequence;
```

### 1G. Extract ALL Dynamic Actions (JavaScript/Client Logic)
```sql
-- Dynamic actions = client-side interactivity
SELECT page_id,
       dynamic_action_name,
       dynamic_action_sequence,
       dynamic_action_event,       -- Change, Click, Page Load, etc.
       dynamic_action_condition,
       when_selection_type,
       when_element,
       when_condition,
       created_on,
       last_updated_on
FROM apex_application_page_da
WHERE application_id = 102
ORDER BY page_id, dynamic_action_sequence;

-- Dynamic action details (the actual actions)
SELECT da.page_id,
       da.dynamic_action_name,
       daa.action_sequence,
       daa.action_name,
       daa.execute_on_page_init,
       daa.action_code,           -- JavaScript code!
       daa.affected_elements,
       daa.attribute_01,
       daa.attribute_02
FROM apex_application_page_da da
JOIN apex_application_page_da_acts daa 
  ON da.dynamic_action_id = daa.dynamic_action_id
WHERE da.application_id = 102
ORDER BY da.page_id, da.dynamic_action_sequence;
```

### 1H. Extract ALL Navigation (Menus, Lists, Breadcrumbs)
```sql
-- Navigation lists (sidebar menu)
SELECT list_name,
       list_id,
       list_status
FROM apex_application_lists
WHERE application_id = 102;

-- Navigation list entries (menu items with badges)
SELECT le.list_name,
       le.entry_text,           -- Menu item label
       le.entry_target,         -- URL/page link
       le.entry_image,          -- Icon class
       le.display_sequence,
       le.entry_attribute_01,   -- Badge value/source
       le.entry_attribute_02,
       le.condition_type,
       le.condition_expression1
FROM apex_application_list_entries le
WHERE le.application_id = 102
ORDER BY le.list_name, le.display_sequence;

-- Breadcrumbs
SELECT entry_label,
       entry_target,
       parent_entry,
       display_sequence
FROM apex_application_bc_entries
WHERE application_id = 102
ORDER BY display_sequence;
```

### 1I. Extract ALL LOVs (Dropdowns, Select Lists)
```sql
-- List of Values definitions
SELECT lov_name,
       lov_id,
       lov_type,
       lov_query            -- The SQL that populates dropdowns!
FROM apex_application_lovs
WHERE application_id = 102
ORDER BY lov_name;
```

### 1J. Extract ALL Authorization Schemes (Permissions)
```sql
-- Security / role-based access
SELECT authorization_scheme_name,
       authorization_scheme_id,
       scheme_type,
       attribute_01,        -- Typically the check expression
       error_message,
       caching,
       created_on
FROM apex_application_authorization
WHERE application_id = 102;
```

### 1K. Extract ALL Computations
```sql
-- Page & application computations
SELECT page_id,
       computation_item,
       computation_sequence,
       computation_type,
       computation,         -- The actual computation logic
       compute_when,
       compute_when_type
FROM apex_application_page_comp
WHERE application_id = 102
ORDER BY page_id, computation_sequence;
```

### 1L. Extract ALL Buttons
```sql
SELECT page_id,
       button_name,
       label,
       button_position,
       button_action,
       button_redirect_url,
       button_execute_validations,
       button_condition,
       button_condition_type,
       button_sequence,
       created_on
FROM apex_application_page_buttons
WHERE application_id = 102
ORDER BY page_id, button_sequence;
```

---

## 2️⃣ APEX_EXPORT PL/SQL API — Automated Bulk Export

### Export a Single App
```sql
-- Run in SQL Workshop > SQL Commands or SQL Developer
DECLARE
    l_files apex_t_export_files;
BEGIN
    l_files := apex_export.get_application(
        p_application_id       => 102,       -- Strategic Planner
        p_split                => TRUE,       -- Split into component files!
        p_with_date            => TRUE,
        p_with_ir_public_reports => TRUE,
        p_with_translations    => TRUE,
        p_with_comments        => TRUE
    );
    
    -- Output file count
    dbms_output.put_line('Exported ' || l_files.count || ' files');
    
    -- List all exported files
    FOR i IN 1..l_files.count LOOP
        dbms_output.put_line(l_files(i).name || ' (' || length(l_files(i).contents) || ' bytes)');
    END LOOP;
END;
/
```

### The Split Export Gives You Individual Files Like:
```
f102/application/set_environment.sql
f102/application/create_application.sql
f102/application/pages/page_00001.sql          -- Each page separate!
f102/application/pages/page_00002.sql
f102/application/shared_components/
    navigation/lists/...
    security/...
    logic/...
    user_interface/...
f102/application/page_groups.sql
```

### Export ALL Apps in a Workspace (Enterprise Scale!)
```sql
-- Export every application in the workspace
DECLARE
    l_files apex_t_export_files;
BEGIN
    FOR app IN (
        SELECT application_id, application_name
        FROM apex_applications
        WHERE workspace = 'APEXDOTNET'
    ) LOOP
        dbms_output.put_line('Exporting: ' || app.application_name || ' (ID: ' || app.application_id || ')');
        
        l_files := apex_export.get_application(
            p_application_id => app.application_id,
            p_split          => TRUE
        );
        
        dbms_output.put_line('  → ' || l_files.count || ' files');
    END LOOP;
END;
/
```

### Export Workspace (Users, Groups, Everything)
```sql
DECLARE
    l_files apex_t_export_files;
BEGIN
    l_files := apex_export.get_workspace(
        p_workspace_id => (SELECT workspace_id FROM apex_workspaces WHERE workspace = 'APEXDOTNET')
    );
    dbms_output.put_line('Workspace export: ' || l_files.count || ' files');
END;
/
```

---

## 3️⃣ APEX Builder REST API (JSON over HTTP)

Your ORDS instance already supports REST access to APEX metadata.

### Base URL
```
https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet
```

### Enable REST Access to Dictionary Views
Run in SQL Workshop:
```sql
BEGIN
    -- Enable ORDS for your schema
    ORDS.ENABLE_SCHEMA(
        p_enabled             => TRUE,
        p_schema              => 'WKSP_APEXDOTNET',
        p_url_mapping_type    => 'BASE_PATH',
        p_url_mapping_pattern => 'apexdotnet',
        p_auto_rest_auth      => FALSE    -- Set TRUE for production!
    );
    COMMIT;
END;
/
```

### Create REST Endpoints for Metadata Extraction
```sql
-- Create a REST module for metadata extraction
BEGIN
    ORDS.DEFINE_MODULE(
        p_module_name    => 'apex-metadata',
        p_base_path      => '/metadata/',
        p_items_per_page => 1000,
        p_status         => 'PUBLISHED',
        p_comments       => 'APEX Application Metadata Extraction API'
    );
    
    -- Endpoint: GET /metadata/pages
    ORDS.DEFINE_TEMPLATE(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'pages'
    );
    ORDS.DEFINE_HANDLER(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'pages',
        p_method         => 'GET',
        p_source_type    => 'json/collection',
        p_source         => 'SELECT page_id, page_name, page_title, page_mode, page_group, 
                                    page_function, created_on, last_updated_on
                             FROM apex_application_pages
                             WHERE application_id = 102
                             ORDER BY page_id'
    );
    
    -- Endpoint: GET /metadata/regions
    ORDS.DEFINE_TEMPLATE(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'regions'
    );
    ORDS.DEFINE_HANDLER(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'regions',
        p_method         => 'GET',
        p_source_type    => 'json/collection',
        p_source         => 'SELECT page_id, region_name, source_type, region_source,
                                    template, display_sequence, region_position
                             FROM apex_application_page_regions
                             WHERE application_id = 102
                             ORDER BY page_id, display_sequence'
    );
    
    -- Endpoint: GET /metadata/processes (business logic)
    ORDS.DEFINE_TEMPLATE(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'processes'
    );
    ORDS.DEFINE_HANDLER(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'processes',
        p_method         => 'GET',
        p_source_type    => 'json/collection',
        p_source         => 'SELECT page_id, process_name, process_type, process_source,
                                    process_point, process_error_message
                             FROM apex_application_page_proc
                             WHERE application_id = 102
                             ORDER BY page_id, process_sequence'
    );
    
    -- Endpoint: GET /metadata/items (form fields)
    ORDS.DEFINE_TEMPLATE(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'items'
    );
    ORDS.DEFINE_HANDLER(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'items',
        p_method         => 'GET',
        p_source_type    => 'json/collection',
        p_source         => 'SELECT page_id, item_name, display_as, label, 
                                    item_source_type, item_source, is_required,
                                    lov_named_lov, lov_definition
                             FROM apex_application_page_items
                             WHERE application_id = 102
                             ORDER BY page_id, display_sequence'
    );
    
    -- Endpoint: GET /metadata/validations (business rules)
    ORDS.DEFINE_TEMPLATE(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'validations'
    );
    ORDS.DEFINE_HANDLER(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'validations',
        p_method         => 'GET',
        p_source_type    => 'json/collection',
        p_source         => 'SELECT page_id, validation_name, validation_type,
                                    validation_expression1, validation_expression2,
                                    error_message, associated_item
                             FROM apex_application_page_val
                             WHERE application_id = 102
                             ORDER BY page_id, validation_sequence'
    );
    
    -- Endpoint: GET /metadata/navigation
    ORDS.DEFINE_TEMPLATE(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'navigation'
    );
    ORDS.DEFINE_HANDLER(
        p_module_name    => 'apex-metadata',
        p_pattern        => 'navigation',
        p_method         => 'GET',
        p_source_type    => 'json/collection',
        p_source         => 'SELECT le.list_name, le.entry_text, le.entry_target,
                                    le.entry_image, le.display_sequence,
                                    le.entry_attribute_01
                             FROM apex_application_list_entries le
                             WHERE le.application_id = 102
                             ORDER BY le.list_name, le.display_sequence'
    );
    
    COMMIT;
END;
/
```

### Then Call from Anywhere
```bash
# From terminal or CI/CD pipeline
curl https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/metadata/pages
curl https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/metadata/regions
curl https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/metadata/processes
curl https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/metadata/items
curl https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/metadata/validations
curl https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/metadata/navigation
```

---

## 4️⃣ The "Master Extraction" Script — Run This First

Copy and paste this into **SQL Workshop > SQL Commands** to get a complete inventory:

```sql
-- ============================================================
-- MASTER APEX APP EXTRACTION REPORT
-- Run in: SQL Workshop > SQL Commands
-- Target: Strategic Planner (App 102)
-- ============================================================

SET SERVEROUTPUT ON SIZE UNLIMITED

DECLARE
    v_app_id NUMBER := 102;
    v_count  NUMBER;
BEGIN
    dbms_output.put_line('=== APEX APPLICATION EXTRACTION REPORT ===');
    dbms_output.put_line('Application ID: ' || v_app_id);
    dbms_output.put_line('Generated: ' || TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS'));
    dbms_output.put_line('');
    
    -- App Info
    FOR app IN (
        SELECT application_name, owner, pages, last_updated_on
        FROM apex_applications
        WHERE application_id = v_app_id
    ) LOOP
        dbms_output.put_line('App Name: ' || app.application_name);
        dbms_output.put_line('Owner: ' || app.owner);
        dbms_output.put_line('Total Pages: ' || app.pages);
        dbms_output.put_line('Last Updated: ' || app.last_updated_on);
    END LOOP;
    
    dbms_output.put_line('');
    dbms_output.put_line('--- COMPONENT INVENTORY ---');
    
    -- Pages
    SELECT COUNT(*) INTO v_count FROM apex_application_pages WHERE application_id = v_app_id;
    dbms_output.put_line('Pages: ' || v_count);
    
    -- Regions
    SELECT COUNT(*) INTO v_count FROM apex_application_page_regions WHERE application_id = v_app_id;
    dbms_output.put_line('Regions: ' || v_count);
    
    -- Items (form fields)
    SELECT COUNT(*) INTO v_count FROM apex_application_page_items WHERE application_id = v_app_id;
    dbms_output.put_line('Page Items: ' || v_count);
    
    -- Buttons
    SELECT COUNT(*) INTO v_count FROM apex_application_page_buttons WHERE application_id = v_app_id;
    dbms_output.put_line('Buttons: ' || v_count);
    
    -- Processes
    SELECT COUNT(*) INTO v_count FROM apex_application_page_proc WHERE application_id = v_app_id;
    dbms_output.put_line('Processes: ' || v_count);
    
    -- Validations
    SELECT COUNT(*) INTO v_count FROM apex_application_page_val WHERE application_id = v_app_id;
    dbms_output.put_line('Validations: ' || v_count);
    
    -- Dynamic Actions
    SELECT COUNT(*) INTO v_count FROM apex_application_page_da WHERE application_id = v_app_id;
    dbms_output.put_line('Dynamic Actions: ' || v_count);
    
    -- Computations
    SELECT COUNT(*) INTO v_count FROM apex_application_page_comp WHERE application_id = v_app_id;
    dbms_output.put_line('Computations: ' || v_count);
    
    -- LOVs
    SELECT COUNT(*) INTO v_count FROM apex_application_lovs WHERE application_id = v_app_id;
    dbms_output.put_line('LOVs: ' || v_count);
    
    -- Lists (Navigation)
    SELECT COUNT(*) INTO v_count FROM apex_application_lists WHERE application_id = v_app_id;
    dbms_output.put_line('Navigation Lists: ' || v_count);
    
    -- Auth Schemes
    SELECT COUNT(*) INTO v_count FROM apex_application_authorization WHERE application_id = v_app_id;
    dbms_output.put_line('Authorization Schemes: ' || v_count);
    
    -- Breadcrumbs
    SELECT COUNT(*) INTO v_count FROM apex_application_bc_entries WHERE application_id = v_app_id;
    dbms_output.put_line('Breadcrumb Entries: ' || v_count);
    
    dbms_output.put_line('');
    dbms_output.put_line('--- PAGE DETAILS ---');
    
    FOR pg IN (
        SELECT page_id, page_name, page_mode,
               (SELECT COUNT(*) FROM apex_application_page_regions r WHERE r.application_id = v_app_id AND r.page_id = p.page_id) as regions,
               (SELECT COUNT(*) FROM apex_application_page_items i WHERE i.application_id = v_app_id AND i.page_id = p.page_id) as items,
               (SELECT COUNT(*) FROM apex_application_page_proc pr WHERE pr.application_id = v_app_id AND pr.page_id = p.page_id) as processes,
               (SELECT COUNT(*) FROM apex_application_page_da da WHERE da.application_id = v_app_id AND da.page_id = p.page_id) as dynamic_actions
        FROM apex_application_pages p
        WHERE application_id = v_app_id
        ORDER BY page_id
    ) LOOP
        dbms_output.put_line(
            'Page ' || LPAD(pg.page_id, 4) || ': ' || RPAD(pg.page_name, 30) || 
            ' | Regions:' || LPAD(pg.regions, 3) ||
            ' Items:' || LPAD(pg.items, 3) ||
            ' Proc:' || LPAD(pg.processes, 3) ||
            ' DA:' || LPAD(pg.dynamic_actions, 3) ||
            ' | Mode: ' || pg.page_mode
        );
    END LOOP;
    
    dbms_output.put_line('');
    dbms_output.put_line('--- BUSINESS LOGIC (PL/SQL Processes) ---');
    
    FOR proc IN (
        SELECT page_id, process_name, process_type, 
               SUBSTR(process_source, 1, 200) as source_preview
        FROM apex_application_page_proc
        WHERE application_id = v_app_id
        ORDER BY page_id, process_sequence
    ) LOOP
        dbms_output.put_line('');
        dbms_output.put_line('[Page ' || proc.page_id || '] ' || proc.process_name || ' (' || proc.process_type || ')');
        IF proc.source_preview IS NOT NULL THEN
            dbms_output.put_line('  Code: ' || proc.source_preview);
        END IF;
    END LOOP;
    
    dbms_output.put_line('');
    dbms_output.put_line('=== EXTRACTION COMPLETE ===');
END;
/
```

---

## 5️⃣ Enterprise Migration Strategy

### Phase 1: Inventory (Automated)
```sql
-- Run across ALL apps to get migration scope
SELECT a.application_id,
       a.application_name,
       a.pages,
       (SELECT COUNT(*) FROM apex_application_page_regions r WHERE r.application_id = a.application_id) total_regions,
       (SELECT COUNT(*) FROM apex_application_page_items i WHERE i.application_id = a.application_id) total_items,
       (SELECT COUNT(*) FROM apex_application_page_proc p WHERE p.application_id = a.application_id) total_processes,
       (SELECT COUNT(*) FROM apex_application_page_val v WHERE v.application_id = a.application_id) total_validations,
       (SELECT COUNT(*) FROM apex_application_page_da d WHERE d.application_id = a.application_id) total_dynamic_actions,
       a.last_updated_on
FROM apex_applications a
ORDER BY a.pages DESC;
```

### Phase 2: Complexity Scoring
```sql
-- Score each app by migration complexity
SELECT application_id,
       application_name,
       pages,
       (SELECT COUNT(*) FROM apex_application_page_proc WHERE application_id = a.application_id AND process_type_code = 'PLSQL') plsql_processes,
       (SELECT COUNT(*) FROM apex_application_page_da WHERE application_id = a.application_id) dynamic_actions,
       (SELECT COUNT(*) FROM apex_application_page_val WHERE application_id = a.application_id) validations,
       ROUND(
           pages * 2 + 
           (SELECT COUNT(*) FROM apex_application_page_proc WHERE application_id = a.application_id) * 3 +
           (SELECT COUNT(*) FROM apex_application_page_da WHERE application_id = a.application_id) * 1.5 +
           (SELECT COUNT(*) FROM apex_application_page_val WHERE application_id = a.application_id) * 2
       ) as complexity_score
FROM apex_applications a
ORDER BY complexity_score DESC;
```

### Phase 3: Component Mapping (APEX → .NET/Angular)

| APEX Component | Dictionary View | .NET/Angular Target |
|---------------|----------------|---------------------|
| Page | `apex_application_pages` | Angular Route + Component |
| Region (Report) | `apex_application_page_regions` | Angular Component + Service |
| Region (Form) | `apex_application_page_regions` | Angular Reactive Form |
| Page Item | `apex_application_page_items` | Form Control / Input |
| Process (DML) | `apex_application_page_proc` | .NET API Controller + EF Core |
| Process (PL/SQL) | `apex_application_page_proc` | .NET Service Class |
| Validation | `apex_application_page_val` | Angular Validators + .NET FluentValidation |
| Dynamic Action | `apex_application_page_da` | Angular Event Handlers |
| LOV | `apex_application_lovs` | .NET Lookup Endpoint |
| Navigation List | `apex_application_list_entries` | Angular Router + Sidenav |
| Auth Scheme | `apex_application_authorization` | .NET Authorization Policy |
| Breadcrumb | `apex_application_bc_entries` | Angular Breadcrumb Component |
| Button | `apex_application_page_buttons` | Angular Material Button |
| Computation | `apex_application_page_comp` | .NET Computed Property |

---

## 6️⃣ Export the Data as JSON (For Migration Tool Input)

```sql
-- Generate JSON output that a migration tool can consume
SELECT JSON_OBJECT(
    'application' VALUE JSON_OBJECT(
        'id' VALUE a.application_id,
        'name' VALUE a.application_name,
        'owner' VALUE a.owner,
        'pages' VALUE a.pages,
        'lastUpdated' VALUE a.last_updated_on
    ),
    'pageList' VALUE (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'pageId' VALUE p.page_id,
                'pageName' VALUE p.page_name,
                'pageMode' VALUE p.page_mode
            )
        )
        FROM apex_application_pages p
        WHERE p.application_id = a.application_id
    )
) AS app_metadata
FROM apex_applications a
WHERE a.application_id = 102;
```

---

## 🎯 Quick Start: Run These 3 Commands First

Open **SQL Workshop > SQL Commands** in your APEX instance and run:

### Command 1: What apps do I have?
```sql
SELECT application_id, application_name, pages FROM apex_applications WHERE workspace = 'APEXDOTNET';
```

### Command 2: What's in Strategic Planner?
```sql
SELECT page_id, page_name, page_mode FROM apex_application_pages WHERE application_id = 102 ORDER BY page_id;
```

### Command 3: Show me the business logic
```sql
SELECT page_id, process_name, process_type, process_source 
FROM apex_application_page_proc 
WHERE application_id = 102 
ORDER BY page_id;
```

---

## 📊 What This Proves for Enterprise

1. **100% Metadata Accessible** — Every APEX component is queryable via SQL
2. **Fully Automatable** — No manual clicking; scripts run across hundreds of apps
3. **Structured Output** — JSON/CSV/SQL output feeds directly into migration tools
4. **Version Trackable** — `last_updated_on` shows what changed and when
5. **Complexity Measurable** — Automated scoring before you commit to migration
6. **Business Logic Preserved** — PL/SQL source code is extractable and translatable
7. **CI/CD Compatible** — REST endpoints enable pipeline integration

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| This document | Complete extraction methodology |
| `apex-exports/sampleapp.sql` | Existing export (Sample Calendar app) |
| `apex-exports/schema.sql` | Database schema DDL |

## Next Steps

1. **Run the Master Extraction Script** (Section 4) in SQL Workshop
2. **Save the output** — paste results into a new file: `apex-exports/strategic-planner-inventory.txt`
3. **Run the JSON export** (Section 6) — save as `apex-exports/strategic-planner-metadata.json`
4. **Create REST endpoints** (Section 3) — enables automated CI/CD extraction
5. **Build the migration tool** — parse the metadata and generate .NET/Angular code

-- ============================================================
-- APEX METADATA EXTRACTION SCRIPT
-- Purpose: Extract UI layout and business logic from APEX App 102
-- Target:  Strategic Planner (Our Strategic Planner)
-- 
-- HOW TO RUN:
--   APEX SQL Workshop > SQL Commands only runs ONE statement
--   at a time. Copy/paste each query individually.
--   Or use SQL Workshop > SQL Scripts to upload this file
--   and run all at once.
--
-- OPTION A (Easy): Copy ONE query at a time into SQL Commands
-- OPTION B (All at once): Use the PL/SQL block at the bottom
--   that combines everything into a single executable block
--
-- Enterprise Proof: This same script works on ANY APEX app.
--   Just change 102 to target a different application.
-- ============================================================


-- ============================================================
-- QUERY 1: ALL APPLICATIONS IN WORKSPACE
-- Copy this into SQL Commands and click Run
-- ============================================================
SELECT application_id, 
       application_name, 
       pages,
       owner,
       last_updated_on
FROM apex_applications
WHERE workspace = 'APEXDOTNET'
ORDER BY application_id;


-- ============================================================
-- QUERY 2: ALL PAGES (UI Layout)
-- ============================================================
SELECT page_id, 
       page_name, 
       page_title,
       page_mode,
       page_group,
       page_function
FROM apex_application_pages
WHERE application_id = 102
ORDER BY page_id;


-- ============================================================
-- QUERY 3: ALL REGIONS (UI Components)
-- ============================================================
SELECT page_id,
       display_sequence,
       region_name,
       source_type,
       region_position,
       template
FROM apex_application_page_regions
WHERE application_id = 102
ORDER BY page_id, display_sequence;


-- ============================================================
-- QUERY 4: REGION SOURCE CODE (SQL/HTML behind each region)
-- ============================================================
SELECT page_id,
       region_name,
       source_type,
       region_source
FROM apex_application_page_regions
WHERE application_id = 102
  AND region_source IS NOT NULL
ORDER BY page_id, display_sequence;


-- ============================================================
-- QUERY 5: ALL PAGE ITEMS (Form Fields)
-- ============================================================
SELECT page_id,
       item_name,
       label,
       display_as,
       item_source_type,
       item_source,
       is_required,
       lov_named_lov,
       item_default
FROM apex_application_page_items
WHERE application_id = 102
ORDER BY page_id, display_sequence;


-- ============================================================
-- QUERY 6: ALL PROCESSES (Business Logic - PL/SQL)
-- ============================================================
SELECT page_id,
       process_name,
       process_sequence,
       process_point,
       process_type,
       process_source
FROM apex_application_page_proc
WHERE application_id = 102
ORDER BY page_id, process_sequence;


-- ============================================================
-- QUERY 7: ALL VALIDATIONS (Business Rules)
-- ============================================================
SELECT page_id,
       validation_name,
       validation_type,
       validation_expression1,
       validation_expression2,
       error_message,
       associated_item
FROM apex_application_page_val
WHERE application_id = 102
ORDER BY page_id, validation_sequence;


-- ============================================================
-- QUERY 8: ALL DYNAMIC ACTIONS (Client-Side Logic)
-- ============================================================
SELECT page_id,
       dynamic_action_name,
       dynamic_action_event,
       when_selection_type,
       when_element
FROM apex_application_page_da
WHERE application_id = 102
ORDER BY page_id, dynamic_action_sequence;


-- ============================================================
-- QUERY 9: NAVIGATION (Sidebar Menu)
-- ============================================================
SELECT list_name,
       display_sequence,
       entry_text,
       entry_target,
       entry_image,
       entry_attribute_01
FROM apex_application_list_entries
WHERE application_id = 102
ORDER BY list_name, display_sequence;


-- ============================================================
-- QUERY 10: LOVs (Dropdowns / Select Lists)
-- ============================================================
SELECT lov_name,
       lov_type,
       lov_query
FROM apex_application_lovs
WHERE application_id = 102
ORDER BY lov_name;


-- ============================================================
-- QUERY 11: ALL BUTTONS
-- ============================================================
SELECT page_id,
       button_name,
       label,
       button_position,
       button_action,
       button_redirect_url
FROM apex_application_page_buttons
WHERE application_id = 102
ORDER BY page_id, button_sequence;


-- ============================================================
-- QUERY 12: AUTHORIZATION SCHEMES (Security)
-- ============================================================
SELECT authorization_scheme_name,
       scheme_type,
       attribute_01,
       error_message
FROM apex_application_authorization
WHERE application_id = 102;


-- ============================================================
-- QUERY 13: COMPUTATIONS
-- ============================================================
SELECT page_id,
       computation_item,
       computation_type,
       computation
FROM apex_application_page_comp
WHERE application_id = 102
ORDER BY page_id, computation_sequence;


-- ============================================================
-- QUERY 14: BREADCRUMB ENTRIES
-- ============================================================
SELECT entry_label,
       entry_target,
       parent_entry,
       display_sequence
FROM apex_application_bc_entries
WHERE application_id = 102
ORDER BY display_sequence;


-- ============================================================
-- QUERY 15: TABLES IN SCHEMA
-- ============================================================
SELECT table_name, 
       num_rows,
       last_analyzed
FROM user_tables
ORDER BY table_name;


-- ============================================================
-- QUERY 16: TABLE COLUMNS (all columns in all tables)
-- ============================================================
SELECT table_name,
       column_name,
       data_type,
       data_length,
       nullable,
       column_id
FROM user_tab_columns
ORDER BY table_name, column_id;


-- ============================================================
-- QUERY 17: VIEWS IN SCHEMA
-- ============================================================
SELECT view_name,
       text_length
FROM user_views
ORDER BY view_name;


-- ============================================================
-- QUERY 18: STORED PROCEDURES, FUNCTIONS, TRIGGERS
-- ============================================================
SELECT object_name,
       object_type,
       status,
       created,
       last_ddl_time
FROM user_objects
WHERE object_type IN ('PROCEDURE', 'FUNCTION', 'PACKAGE', 'PACKAGE BODY', 'TRIGGER')
ORDER BY object_type, object_name;


-- ============================================================
-- ============================================================
-- ALL-IN-ONE PL/SQL BLOCK
-- ============================================================
-- Copy EVERYTHING below into SQL Commands and click Run.
-- This runs ALL queries in a single execution and outputs
-- the results via DBMS_OUTPUT.
-- ============================================================

DECLARE
    v_app_id NUMBER := 102;
BEGIN
    -- 1. App inventory
    dbms_output.put_line('=== 1. APPLICATIONS IN WORKSPACE ===');
    FOR r IN (
        SELECT application_id, application_name, pages, owner
        FROM apex_applications
        WHERE workspace = 'APEXDOTNET'
        ORDER BY application_id
    ) LOOP
        dbms_output.put_line(r.application_id || ' | ' || r.application_name || ' | Pages: ' || r.pages || ' | Owner: ' || r.owner);
    END LOOP;

    -- 2. Pages
    dbms_output.put_line('');
    dbms_output.put_line('=== 2. ALL PAGES ===');
    FOR r IN (
        SELECT page_id, page_name, page_mode, page_group
        FROM apex_application_pages
        WHERE application_id = v_app_id
        ORDER BY page_id
    ) LOOP
        dbms_output.put_line('Page ' || r.page_id || ': ' || r.page_name || ' [' || r.page_mode || '] Group: ' || r.page_group);
    END LOOP;

    -- 3. Regions
    dbms_output.put_line('');
    dbms_output.put_line('=== 3. ALL REGIONS ===');
    FOR r IN (
        SELECT page_id, region_name, source_type, region_position, display_sequence
        FROM apex_application_page_regions
        WHERE application_id = v_app_id
        ORDER BY page_id, display_sequence
    ) LOOP
        dbms_output.put_line('Page ' || r.page_id || ' | Seq ' || r.display_sequence || ' | ' || r.region_name || ' | Type: ' || r.source_type || ' | Pos: ' || r.region_position);
    END LOOP;

    -- 4. Region Source (the SQL/HTML behind regions)
    dbms_output.put_line('');
    dbms_output.put_line('=== 4. REGION SOURCE CODE ===');
    FOR r IN (
        SELECT page_id, region_name, source_type, SUBSTR(region_source, 1, 500) AS src
        FROM apex_application_page_regions
        WHERE application_id = v_app_id AND region_source IS NOT NULL
        ORDER BY page_id, display_sequence
    ) LOOP
        dbms_output.put_line('--- Page ' || r.page_id || ': ' || r.region_name || ' (' || r.source_type || ') ---');
        dbms_output.put_line(r.src);
    END LOOP;

    -- 5. Page Items
    dbms_output.put_line('');
    dbms_output.put_line('=== 5. ALL PAGE ITEMS ===');
    FOR r IN (
        SELECT page_id, item_name, label, display_as, is_required, lov_named_lov
        FROM apex_application_page_items
        WHERE application_id = v_app_id
        ORDER BY page_id, display_sequence
    ) LOOP
        dbms_output.put_line('Page ' || r.page_id || ' | ' || r.item_name || ' | Label: ' || r.label || ' | Type: ' || r.display_as || ' | Required: ' || r.is_required || ' | LOV: ' || r.lov_named_lov);
    END LOOP;

    -- 6. Processes (Business Logic)
    dbms_output.put_line('');
    dbms_output.put_line('=== 6. ALL PROCESSES (BUSINESS LOGIC) ===');
    FOR r IN (
        SELECT page_id, process_name, process_type, process_point, SUBSTR(process_source, 1, 500) AS src
        FROM apex_application_page_proc
        WHERE application_id = v_app_id
        ORDER BY page_id, process_sequence
    ) LOOP
        dbms_output.put_line('--- Page ' || r.page_id || ': ' || r.process_name || ' (' || r.process_type || ') Point: ' || r.process_point || ' ---');
        IF r.src IS NOT NULL THEN
            dbms_output.put_line(r.src);
        END IF;
    END LOOP;

    -- 7. Validations
    dbms_output.put_line('');
    dbms_output.put_line('=== 7. ALL VALIDATIONS ===');
    FOR r IN (
        SELECT page_id, validation_name, validation_type, validation_expression1, error_message, associated_item
        FROM apex_application_page_val
        WHERE application_id = v_app_id
        ORDER BY page_id, validation_sequence
    ) LOOP
        dbms_output.put_line('Page ' || r.page_id || ' | ' || r.validation_name || ' | Type: ' || r.validation_type || ' | Item: ' || r.associated_item);
        dbms_output.put_line('  Expr: ' || SUBSTR(r.validation_expression1, 1, 200));
        dbms_output.put_line('  Error: ' || r.error_message);
    END LOOP;

    -- 8. Dynamic Actions
    dbms_output.put_line('');
    dbms_output.put_line('=== 8. ALL DYNAMIC ACTIONS ===');
    FOR r IN (
        SELECT page_id, dynamic_action_name, dynamic_action_event, when_element
        FROM apex_application_page_da
        WHERE application_id = v_app_id
        ORDER BY page_id, dynamic_action_sequence
    ) LOOP
        dbms_output.put_line('Page ' || r.page_id || ' | ' || r.dynamic_action_name || ' | Event: ' || r.dynamic_action_event || ' | Element: ' || r.when_element);
    END LOOP;

    -- 9. Navigation
    dbms_output.put_line('');
    dbms_output.put_line('=== 9. NAVIGATION ===');
    FOR r IN (
        SELECT list_name, entry_text, entry_target, entry_image
        FROM apex_application_list_entries
        WHERE application_id = v_app_id
        ORDER BY list_name, display_sequence
    ) LOOP
        dbms_output.put_line(r.list_name || ' | ' || r.entry_text || ' | ' || r.entry_target || ' | Icon: ' || r.entry_image);
    END LOOP;

    -- 10. LOVs
    dbms_output.put_line('');
    dbms_output.put_line('=== 10. LOVs ===');
    FOR r IN (
        SELECT lov_name, lov_type, SUBSTR(lov_query, 1, 300) AS qry
        FROM apex_application_lovs
        WHERE application_id = v_app_id
        ORDER BY lov_name
    ) LOOP
        dbms_output.put_line(r.lov_name || ' (' || r.lov_type || ')');
        IF r.qry IS NOT NULL THEN
            dbms_output.put_line('  ' || r.qry);
        END IF;
    END LOOP;

    -- 11. Buttons
    dbms_output.put_line('');
    dbms_output.put_line('=== 11. ALL BUTTONS ===');
    FOR r IN (
        SELECT page_id, button_name, label, button_action
        FROM apex_application_page_buttons
        WHERE application_id = v_app_id
        ORDER BY page_id, button_sequence
    ) LOOP
        dbms_output.put_line('Page ' || r.page_id || ' | ' || r.button_name || ' | Label: ' || r.label || ' | Action: ' || r.button_action);
    END LOOP;

    -- 12. Auth Schemes
    dbms_output.put_line('');
    dbms_output.put_line('=== 12. AUTHORIZATION SCHEMES ===');
    FOR r IN (
        SELECT authorization_scheme_name, scheme_type, error_message
        FROM apex_application_authorization
        WHERE application_id = v_app_id
    ) LOOP
        dbms_output.put_line(r.authorization_scheme_name || ' | Type: ' || r.scheme_type || ' | Error: ' || r.error_message);
    END LOOP;

    -- 13. Breadcrumbs
    dbms_output.put_line('');
    dbms_output.put_line('=== 13. BREADCRUMBS ===');
    FOR r IN (
        SELECT entry_label, entry_target, parent_entry
        FROM apex_application_bc_entries
        WHERE application_id = v_app_id
        ORDER BY display_sequence
    ) LOOP
        dbms_output.put_line(r.entry_label || ' -> ' || r.entry_target || ' | Parent: ' || r.parent_entry);
    END LOOP;

    -- 14. Tables
    dbms_output.put_line('');
    dbms_output.put_line('=== 14. DATABASE TABLES ===');
    FOR r IN (
        SELECT table_name, num_rows
        FROM user_tables
        ORDER BY table_name
    ) LOOP
        dbms_output.put_line(r.table_name || ' | Rows: ' || NVL(TO_CHAR(r.num_rows), 'unknown'));
    END LOOP;

    -- 15. Triggers
    dbms_output.put_line('');
    dbms_output.put_line('=== 15. TRIGGERS & PROCEDURES ===');
    FOR r IN (
        SELECT object_name, object_type, status
        FROM user_objects
        WHERE object_type IN ('PROCEDURE', 'FUNCTION', 'PACKAGE', 'PACKAGE BODY', 'TRIGGER')
        ORDER BY object_type, object_name
    ) LOOP
        dbms_output.put_line(r.object_type || ': ' || r.object_name || ' [' || r.status || ']');
    END LOOP;

    -- Summary counts
    dbms_output.put_line('');
    dbms_output.put_line('=== SUMMARY COUNTS ===');
    FOR r IN (
        SELECT 
            (SELECT COUNT(*) FROM apex_application_pages WHERE application_id = v_app_id) AS pages,
            (SELECT COUNT(*) FROM apex_application_page_regions WHERE application_id = v_app_id) AS regions,
            (SELECT COUNT(*) FROM apex_application_page_items WHERE application_id = v_app_id) AS items,
            (SELECT COUNT(*) FROM apex_application_page_buttons WHERE application_id = v_app_id) AS buttons,
            (SELECT COUNT(*) FROM apex_application_page_proc WHERE application_id = v_app_id) AS processes,
            (SELECT COUNT(*) FROM apex_application_page_val WHERE application_id = v_app_id) AS validations,
            (SELECT COUNT(*) FROM apex_application_page_da WHERE application_id = v_app_id) AS dynamic_actions,
            (SELECT COUNT(*) FROM apex_application_lovs WHERE application_id = v_app_id) AS lovs,
            (SELECT COUNT(*) FROM apex_application_list_entries WHERE application_id = v_app_id) AS nav_entries,
            (SELECT COUNT(*) FROM apex_application_authorization WHERE application_id = v_app_id) AS auth_schemes
        FROM dual
    ) LOOP
        dbms_output.put_line('Pages:           ' || r.pages);
        dbms_output.put_line('Regions:         ' || r.regions);
        dbms_output.put_line('Page Items:      ' || r.items);
        dbms_output.put_line('Buttons:         ' || r.buttons);
        dbms_output.put_line('Processes:       ' || r.processes);
        dbms_output.put_line('Validations:     ' || r.validations);
        dbms_output.put_line('Dynamic Actions: ' || r.dynamic_actions);
        dbms_output.put_line('LOVs:            ' || r.lovs);
        dbms_output.put_line('Nav Entries:     ' || r.nav_entries);
        dbms_output.put_line('Auth Schemes:    ' || r.auth_schemes);
    END LOOP;

    dbms_output.put_line('');
    dbms_output.put_line('=== EXTRACTION COMPLETE ===');
END;
/

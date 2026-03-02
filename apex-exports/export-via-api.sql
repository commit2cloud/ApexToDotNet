-- ============================================================
-- APEX EXPORT via PL/SQL API
-- Purpose: Export Strategic Planner as split component files
-- Run in:  SQL Workshop > SQL Commands
-- 
-- HOW TO USE:
--   SQL Commands runs ONE statement at a time.
--   Copy ONE DECLARE...END; block, paste, click Run.
--   Output appears in the results pane below.
--
-- This uses the APEX_EXPORT package to get the full app export
-- split into individual component files — the same format used
-- by version control and CI/CD pipelines.
-- ============================================================


-- ============================================================
-- OPTION A: List all exportable files (dry run)
-- Copy from DECLARE to the / and paste into SQL Commands
-- ============================================================
DECLARE
    l_files apex_t_export_files;
BEGIN
    l_files := apex_export.get_application(
        p_application_id          => 102,
        p_split                   => TRUE,
        p_with_date               => TRUE,
        p_with_ir_public_reports  => TRUE,
        p_with_translations       => TRUE,
        p_with_comments           => TRUE
    );
    
    dbms_output.put_line('=== APEX_EXPORT: Strategic Planner (App 102) ===');
    dbms_output.put_line('Total files: ' || l_files.count);
    dbms_output.put_line('');
    
    FOR i IN 1..l_files.count LOOP
        dbms_output.put_line(
            RPAD(l_files(i).name, 70) || 
            LPAD(LENGTH(l_files(i).contents), 8) || ' bytes'
        );
    END LOOP;
    
    dbms_output.put_line('');
    dbms_output.put_line('=== EXPORT FILE LIST COMPLETE ===');
END;
/


-- ============================================================
-- OPTION B: Export individual page files with content
-- (Run one page at a time in SQL Commands)
-- ============================================================
DECLARE
    l_files apex_t_export_files;
BEGIN
    l_files := apex_export.get_application(
        p_application_id => 102,
        p_split          => TRUE
    );
    
    dbms_output.put_line('=== PAGE FILES WITH CONTENT ===');
    dbms_output.put_line('');
    
    FOR i IN 1..l_files.count LOOP
        -- Only output page files (not shared components, to keep output manageable)
        IF l_files(i).name LIKE '%/pages/%' THEN
            dbms_output.put_line('>>> FILE: ' || l_files(i).name || ' >>>');
            -- Output first 4000 chars of each page file
            dbms_output.put_line(SUBSTR(l_files(i).contents, 1, 4000));
            dbms_output.put_line('<<< END FILE <<<');
            dbms_output.put_line('');
        END IF;
    END LOOP;
END;
/


-- ============================================================
-- OPTION C: Export shared components (navigation, auth, etc.)
-- ============================================================
DECLARE
    l_files apex_t_export_files;
BEGIN
    l_files := apex_export.get_application(
        p_application_id => 102,
        p_split          => TRUE
    );
    
    dbms_output.put_line('=== SHARED COMPONENT FILES ===');
    dbms_output.put_line('');
    
    FOR i IN 1..l_files.count LOOP
        IF l_files(i).name LIKE '%/shared_components/%' THEN
            dbms_output.put_line('>>> FILE: ' || l_files(i).name || ' >>>');
            dbms_output.put_line(SUBSTR(l_files(i).contents, 1, 4000));
            dbms_output.put_line('<<< END FILE <<<');
            dbms_output.put_line('');
        END IF;
    END LOOP;
END;
/


-- ============================================================
-- OPTION D: Export ALL apps in workspace (Enterprise Scale)
-- ============================================================
DECLARE
    l_files   apex_t_export_files;
    l_total   NUMBER := 0;
BEGIN
    dbms_output.put_line('=== ENTERPRISE EXPORT: ALL APPS IN WORKSPACE ===');
    dbms_output.put_line('');
    
    FOR app IN (
        SELECT application_id, application_name, pages
        FROM apex_applications
        WHERE workspace = 'APEXDOTNET'
        ORDER BY application_id
    ) LOOP
        l_files := apex_export.get_application(
            p_application_id => app.application_id,
            p_split          => TRUE
        );
        
        dbms_output.put_line(
            'App ' || LPAD(app.application_id, 6) || ': ' || 
            RPAD(app.application_name, 30) || 
            ' | Pages: ' || LPAD(app.pages, 3) ||
            ' | Export Files: ' || LPAD(l_files.count, 4)
        );
        
        l_total := l_total + l_files.count;
    END LOOP;
    
    dbms_output.put_line('');
    dbms_output.put_line('Total export files across all apps: ' || l_total);
    dbms_output.put_line('=== ENTERPRISE EXPORT COMPLETE ===');
END;
/


-- ============================================================
-- OPTION E: Export to CLOB table for programmatic access
-- (Creates a table you can query from .NET or REST)
-- ============================================================

-- Create staging table (run once)
-- CREATE TABLE apex_export_staging (
--     export_id    NUMBER GENERATED ALWAYS AS IDENTITY,
--     app_id       NUMBER,
--     file_name    VARCHAR2(500),
--     file_content CLOB,
--     exported_on  TIMESTAMP DEFAULT SYSTIMESTAMP,
--     CONSTRAINT apex_export_staging_pk PRIMARY KEY (export_id)
-- );

-- Populate staging table
-- DECLARE
--     l_files apex_t_export_files;
-- BEGIN
--     l_files := apex_export.get_application(
--         p_application_id => 102,
--         p_split          => TRUE
--     );
--     
--     DELETE FROM apex_export_staging WHERE app_id = 102;
--     
--     FOR i IN 1..l_files.count LOOP
--         INSERT INTO apex_export_staging (app_id, file_name, file_content)
--         VALUES (102, l_files(i).name, l_files(i).contents);
--     END LOOP;
--     
--     COMMIT;
--     dbms_output.put_line('Staged ' || l_files.count || ' files for App 102');
-- END;
-- /

-- Then query from .NET/REST:
-- SELECT file_name, file_content FROM apex_export_staging WHERE app_id = 102;

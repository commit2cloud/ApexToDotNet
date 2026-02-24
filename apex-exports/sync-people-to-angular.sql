-- ================================================
-- Sync People from APEX to Angular Mock Data
-- ================================================
-- This script generates TypeScript code to copy/paste
-- into the Angular service
-- 
-- Usage:
-- 1. Run this in APEX SQL Workshop -> SQL Commands
-- 2. Copy the generated TypeScript output
-- 3. Paste into strategic-planner.service.ts getPeople() method
-- 4. Save file and Angular will auto-reload
-- ================================================

SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
  v_output CLOB;
  v_count NUMBER := 0;
  v_total NUMBER;
BEGIN
  -- Get total count
  SELECT COUNT(*) INTO v_total FROM people;
  
  -- Start building TypeScript array
  v_output := '// Auto-generated from APEX - ' || TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') || CHR(10);
  v_output := v_output || 'const people = [' || CHR(10);
  
  -- Loop through all people
  FOR person IN (
    SELECT id, 
           first_name, 
           last_name, 
           email, 
           country, 
           email_domain, 
           phone_number, 
           app_role,
           has_screen_name
    FROM people
    ORDER BY id
  ) LOOP
    v_count := v_count + 1;
    
    -- Build TypeScript object
    v_output := v_output || '  {' || CHR(10);
    v_output := v_output || '    id: ' || person.id || ',' || CHR(10);
    v_output := v_output || '    firstName: ''' || REPLACE(person.first_name, '''', '\\''') || ''',' || CHR(10);
    v_output := v_output || '    lastName: ''' || REPLACE(person.last_name, '''', '\\''') || ''',' || CHR(10);
    v_output := v_output || '    email: ''' || REPLACE(person.email, '''', '\\''') || ''',' || CHR(10);
    v_output := v_output || '    country: ''' || REPLACE(NVL(person.country, 'United States'), '''', '\\''') || ''',' || CHR(10);
    v_output := v_output || '    emailDomain: ''' || REPLACE(NVL(person.email_domain, 'acme.com'), '''', '\\''') || ''',' || CHR(10);
    v_output := v_output || '    phoneNumber: ''' || NVL(person.phone_number, '+1-555-0100') || ''',' || CHR(10);
    v_output := v_output || '    hasScreenName: ' || CASE WHEN NVL(person.has_screen_name, 'N') = 'Y' THEN 'true' ELSE 'false' END || ',' || CHR(10);
    v_output := v_output || '    appRole: ''' || REPLACE(NVL(person.app_role, 'No Access'), '''', '\\''') || ''',' || CHR(10);
    v_output := v_output || '    tags: [],' || CHR(10);
    v_output := v_output || '    competencies: []' || CHR(10);
    v_output := v_output || '  }';
    
    -- Add comma if not last item
    IF v_count < v_total THEN
      v_output := v_output || ',';
    END IF;
    
    v_output := v_output || CHR(10);
  END LOOP;
  
  -- Close array
  v_output := v_output || '];' || CHR(10);
  v_output := v_output || CHR(10);
  v_output := v_output || 'return of(people);' || CHR(10);
  
  -- Output header
  DBMS_OUTPUT.PUT_LINE('====================================================================');
  DBMS_OUTPUT.PUT_LINE('  APEX to Angular People Sync - Generated TypeScript Code');
  DBMS_OUTPUT.PUT_LINE('====================================================================');
  DBMS_OUTPUT.PUT_LINE('');
  DBMS_OUTPUT.PUT_LINE('Copy everything between the arrows and paste into:');
  DBMS_OUTPUT.PUT_LINE('ApexToDotNet.Web/src/app/services/strategic-planner.service.ts');
  DBMS_OUTPUT.PUT_LINE('Replace the getPeople() method content');
  DBMS_OUTPUT.PUT_LINE('');
  DBMS_OUTPUT.PUT_LINE('>>> START COPY HERE >>>');
  DBMS_OUTPUT.PUT_LINE('');
  
  -- Output generated code
  DBMS_OUTPUT.PUT_LINE(v_output);
  
  -- Output footer
  DBMS_OUTPUT.PUT_LINE('');
  DBMS_OUTPUT.PUT_LINE('<<< END COPY HERE <<<');
  DBMS_OUTPUT.PUT_LINE('');
  DBMS_OUTPUT.PUT_LINE('====================================================================');
  DBMS_OUTPUT.PUT_LINE('✅ Generated ' || v_count || ' people records');
  DBMS_OUTPUT.PUT_LINE('📅 Generated: ' || TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS'));
  DBMS_OUTPUT.PUT_LINE('====================================================================');
  
  -- Error handling
  IF v_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('⚠️  WARNING: No people found in database!');
    DBMS_OUTPUT.PUT_LINE('   Make sure you have added people in APEX first.');
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('❌ ERROR: ' || SQLERRM);
    DBMS_OUTPUT.PUT_LINE('   Check that the PEOPLE table exists and has data.');
END;
/

-- Verification query
PROMPT
PROMPT ====================================================================
PROMPT Verification: Current People in APEX
PROMPT ====================================================================

SELECT id, 
       first_name || ' ' || last_name AS "Full Name",
       email AS "Email",
       country AS "Country",
       app_role AS "App Role"
FROM people
ORDER BY id;

PROMPT
PROMPT ====================================================================
PROMPT Next Steps:
PROMPT 1. Copy the TypeScript code above (between the arrows)
PROMPT 2. Open: ApexToDotNet.Web/src/app/services/strategic-planner.service.ts
PROMPT 3. Find the getPeople() method
PROMPT 4. Replace the method content with the copied code
PROMPT 5. Save file - Angular will auto-reload!
PROMPT ====================================================================

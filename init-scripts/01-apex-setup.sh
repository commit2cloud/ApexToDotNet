#!/bin/bash
# Post-initialization script for Oracle APEX setup
# This script runs after the database is created and started

echo "=========================================="
echo "Starting APEX post-initialization setup..."
echo "=========================================="

# Wait for database to be fully ready with polling
echo "Waiting for database to be ready..."
MAX_ATTEMPTS=60
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if sqlplus -s / as sysdba <<EOF > /dev/null 2>&1
SET HEADING OFF
SET FEEDBACK OFF
SELECT status FROM v\$instance;
EXIT
EOF
    then
        echo "Database is ready!"
        break
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    echo "Waiting for database... attempt $ATTEMPT of $MAX_ATTEMPTS"
    sleep 5
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "ERROR: Database did not become ready in time"
    exit 1
fi

# Set up APEX workspace and configuration
sqlplus -s sys/${ORACLE_PWD}@XE as sysdba <<EOF
-- Set container to pluggable database
ALTER SESSION SET CONTAINER = XEPDB1;

-- Unlock APEX users if needed
ALTER USER APEX_PUBLIC_USER ACCOUNT UNLOCK;
ALTER USER APEX_REST_PUBLIC_USER ACCOUNT UNLOCK;

-- Configure APEX instance settings
BEGIN
    -- Set APEX admin email
    APEX_INSTANCE_ADMIN.SET_PARAMETER(
        p_parameter => 'INSTANCE_EMAIL',
        p_value     => 'admin@example.com'
    );
    
    -- Set workspace purge settings (optional)
    APEX_INSTANCE_ADMIN.SET_PARAMETER(
        p_parameter => 'WORKSPACE_PURGE_ENABLED',
        p_value     => 'N'
    );
    
    COMMIT;
END;
/

-- Show APEX version
SELECT 'APEX Version: ' || version_no FROM apex_release;

-- Show available workspaces
SELECT 'Available Workspaces:' AS info FROM dual;
SELECT workspace_id, workspace, workspace_display_name 
FROM apex_workspaces 
ORDER BY workspace;

COMMIT;
EXIT;
EOF

echo "=========================================="
echo "APEX setup completed!"
echo "=========================================="
echo ""
echo "Access APEX at: http://localhost:8080/ords"
echo "Admin interface: http://localhost:8080/ords/apex_admin"
echo ""
echo "Default credentials:"
echo "  Workspace: INTERNAL"
echo "  Username: ADMIN"
echo "  Password: (check your .env file or docker-compose.yml)"
echo ""
echo "IMPORTANT: Change the default password immediately!"
echo "=========================================="

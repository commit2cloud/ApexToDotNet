# Initialization Scripts

This directory contains scripts that run automatically when the Oracle Database container is first initialized.

## How It Works

The Oracle Database Docker image executes scripts found in `/docker-entrypoint-initdb.d/` during the first startup. The `docker-compose.yml` mounts this directory to that location.

## Execution Order

Scripts are executed in alphabetical order:
1. `01-apex-setup.sh` - Configures APEX after database initialization

## Adding Custom Scripts

To add your own initialization scripts:

1. Create a new `.sh` or `.sql` file in this directory
2. Use a numeric prefix to control execution order (e.g., `02-my-script.sh`)
3. Make shell scripts executable: `chmod +x init-scripts/02-my-script.sh`

### Example SQL Script

```sql
-- 02-create-workspace.sql
-- Creates a custom workspace for development

BEGIN
    APEX_INSTANCE_ADMIN.ADD_WORKSPACE(
        p_workspace_id   => NULL,
        p_workspace      => 'DEV_WORKSPACE',
        p_primary_schema => 'DEV_SCHEMA'
    );
END;
/
```

### Example Shell Script

```bash
#!/bin/bash
# 03-import-sample-app.sh
# Imports a sample APEX application

echo "Importing sample application..."
sqlplus sys/${ORACLE_PWD}@XE as sysdba <<EOF
@/path/to/sample-app.sql
EXIT;
EOF
```

## Environment Variables

Scripts have access to environment variables defined in `docker-compose.yml`:
- `ORACLE_PWD` - The SYS/SYSTEM password
- `ORACLE_CHARACTERSET` - Database character set

## Notes

- Scripts only run during **first initialization** (when volumes are created)
- To re-run scripts, remove volumes: `docker-compose down -v`
- Scripts must be idempotent if you need to run them multiple times
- Check logs for script output: `docker-compose logs apex-db`

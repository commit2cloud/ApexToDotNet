# Oracle APEX Stand-alone Setup Guide

This guide walks you through setting up a stand-alone Oracle APEX instance on your local machine for development and testing purposes. This is essential for testing the ApexToDotNet migration tools and understanding APEX applications before migration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Detailed Installation Steps](#detailed-installation-steps)
- [Post-Installation Configuration](#post-installation-configuration)
- [Accessing APEX](#accessing-apex)
- [Creating a Workspace](#creating-a-workspace)
- [Troubleshooting](#troubleshooting)
- [Alternative Installation Methods](#alternative-installation-methods)

## Prerequisites

Before you begin, ensure you have the following:

- **Docker Desktop** (recommended) or Docker Engine with Docker Compose
  - Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - macOS: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - Linux: [Docker Engine](https://docs.docker.com/engine/install/)
- **Minimum System Requirements:**
  - 8 GB RAM (16 GB recommended)
  - 20 GB free disk space
  - Internet connection for downloading images
- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)

## Quick Start with Docker

The fastest way to get Oracle APEX running is using Docker Compose:

### Step 1: Clone the Repository

```bash
git clone https://github.com/github/ApexToDotNet.git
cd ApexToDotNet
```

### Step 2: Start the Container

```bash
docker-compose up -d
```

This will:
- Pull the Oracle Database 21c XE image (if not already present)
- Install Oracle APEX 24.2
- Configure the database
- Start all required services

### Step 3: Wait for Initialization

The first startup takes 5-10 minutes as the database initializes. Monitor progress:

```bash
docker-compose logs -f
```

Wait until you see: `DATABASE IS READY TO USE!`

### Step 4: Access APEX

Open your browser and navigate to:
- **APEX URL:** http://localhost:8080/ords
- **Admin URL:** http://localhost:8080/ords/apex_admin

Default credentials:
- **Workspace:** INTERNAL
- **Username:** ADMIN
- **Password:** Oracle123! (change this immediately)

## Detailed Installation Steps

### Understanding the Architecture

The Docker setup includes:

1. **Oracle Database 21c Express Edition (XE)** - The database engine
2. **Oracle APEX 24.2** - The application development framework
3. **Oracle REST Data Services (ORDS)** - The web server for APEX

### Container Configuration

The `docker-compose.yml` file configures:

- **Ports:**
  - `8080` - APEX/ORDS web interface
  - `1521` - Oracle Database listener
  
- **Volumes:**
  - `oracle-data` - Persistent database storage
  - `ords-config` - ORDS configuration files
  
- **Environment Variables:**
  - `ORACLE_PWD` - SYS/SYSTEM password
  - `APEX_PUBLIC_USER_PWD` - APEX public user password

### Network Configuration

By default, the container runs on `localhost`. To access from other machines on your network:

1. Find your machine's IP address:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. Access APEX using: `http://<your-ip>:8080/ords`

## Post-Installation Configuration

### 1. Change Default Passwords

Immediately after first login:

1. Log in as `ADMIN` to `INTERNAL` workspace
2. Navigate to: **Manage Workspace → Set Workspace Password**
3. Set a strong password

Also change the database passwords:

```bash
docker exec -it apex-db sqlplus sys/Oracle123!@XE as sysdba

ALTER USER SYSTEM IDENTIFIED BY "YourNewPassword";
ALTER USER SYS IDENTIFIED BY "YourNewPassword";
exit
```

### 2. Enable Additional Features

Enable commonly needed features:

```sql
-- Connect as SYS
docker exec -it apex-db sqlplus sys/Oracle123!@XE as sysdba

-- Enable Oracle Text (for full-text search)
@?/rdbms/admin/catoctx.sql

-- Verify APEX version
SELECT * FROM apex_release;
```

### 3. Configure ORDS Settings

Customize ORDS for development:

```bash
docker exec -it apex-db bash
cd /opt/oracle/ords/config
vi settings.xml
```

Recommended development settings:
- Enable SQL Developer Web
- Configure debug logging
- Adjust connection pool sizes

## Accessing APEX

### APEX Instance Administration

URL: `http://localhost:8080/ords/apex_admin`

Use this to:
- Manage workspaces
- Monitor instance activity
- Configure instance settings
- Manage storage

### Workspace Access

URL: `http://localhost:8080/ords`

Each workspace has its own URL pattern:
`http://localhost:8080/ords/f?p=workspace`

### SQL Developer Web

URL: `http://localhost:8080/ords/sql-developer`

Provides browser-based SQL access.

## Creating a Workspace

To create a new workspace for development:

### Via Admin Interface

1. Log in to: `http://localhost:8080/ords/apex_admin`
2. Click **Create Workspace**
3. Enter details:
   - **Workspace Name:** MY_WORKSPACE
   - **Workspace ID:** Leave blank (auto-assigned)
   - **Database User:** Create new schema: MY_SCHEMA
   - **Password:** Set a strong password
   - **Space Quota:** 100 MB (or as needed)
4. Click **Create Workspace**

### Via SQL

```sql
docker exec -it apex-db sqlplus sys/Oracle123!@XE as sysdba

-- Create workspace and schema
BEGIN
    APEX_INSTANCE_ADMIN.ADD_WORKSPACE(
        p_workspace_id   => NULL,
        p_workspace      => 'MY_WORKSPACE',
        p_primary_schema => 'MY_SCHEMA'
    );
    
    APEX_INSTANCE_ADMIN.ADD_WORKSPACE_SCHEMA(
        p_workspace => 'MY_WORKSPACE',
        p_schema    => 'MY_SCHEMA'
    );
END;
/

-- Create user account
DECLARE
    l_user_id NUMBER;
BEGIN
    l_user_id := APEX_UTIL.CREATE_USER(
        p_user_name    => 'MYUSER',
        p_web_password => 'YourPassword123!',
        p_email_address => 'user@example.com'
    );
    
    -- Grant developer privilege
    APEX_UTIL.SET_ACCOUNT_STATUS(
        p_user_name => 'MYUSER',
        p_account_status => 'DEVELOPER'
    );
END;
/

exit
```

## Troubleshooting

### Container Won't Start

**Error:** Port already in use

```bash
# Check what's using port 8080
# Windows
netstat -ano | findstr :8080

# macOS/Linux
lsof -i :8080

# Use a different port
docker-compose down
# Edit docker-compose.yml to change ports
docker-compose up -d
```

### Database Initialization Fails

**Solution:** Remove volumes and restart

```bash
docker-compose down -v
docker-compose up -d
```

### Can't Connect to Database

**Check if the container is running:**

```bash
docker ps
```

**View logs:**

```bash
docker-compose logs apex-db
```

**Verify listener:**

```bash
docker exec apex-db lsnrctl status
```

### APEX Pages Load Slowly

**Increase memory allocation:**

Edit `docker-compose.yml`:

```yaml
services:
  apex-db:
    # ... other settings ...
    deploy:
      resources:
        limits:
          memory: 4G
```

### ORDS Returns 404

**Wait for full initialization:**

```bash
# Check ORDS logs
docker exec apex-db tail -f /opt/oracle/ords/logs/ords.log
```

### Database Connection Timeout

**Check database status:**

```bash
docker exec -it apex-db sqlplus / as sysdba

SELECT status FROM v$instance;
```

Should return `OPEN`.

## Alternative Installation Methods

### Option 1: Oracle Autonomous Database

For cloud-based development:

1. Sign up for [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
2. Create an Autonomous Database
3. APEX is pre-installed and ready to use
4. No local resources required

**Pros:**
- Always up-to-date
- No local resource usage
- Production-grade infrastructure

**Cons:**
- Requires internet connection
- Limited control over database configuration

### Option 2: Manual Installation on Oracle Database

For advanced users who need full control:

1. Download [Oracle Database XE](https://www.oracle.com/database/technologies/xe-downloads.html)
2. Install Oracle Database XE
3. Download [Oracle APEX](https://www.oracle.com/tools/downloads/apex-downloads.html)
4. Download [ORDS](https://www.oracle.com/database/technologies/appdev/rest-data-services-downloads.html)
5. Follow installation guides:
   - [APEX Installation Guide](https://docs.oracle.com/en/database/oracle/apex/24.2/htmig/)
   - [ORDS Installation Guide](https://docs.oracle.com/en/database/oracle/oracle-rest-data-services/24.3/qsins/)

**Pros:**
- Full control over configuration
- Can customize everything
- Better for understanding APEX internals

**Cons:**
- More complex setup
- Requires manual updates
- OS-specific installation steps

### Option 3: Pre-built VirtualBox Image

Oracle provides VirtualBox images with pre-installed APEX:

1. Download from [Oracle Database VM Images](https://www.oracle.com/database/technologies/databaseappdev-vm.html)
2. Import into VirtualBox
3. Start the VM

**Pros:**
- Everything pre-configured
- Includes sample applications
- Good for training

**Cons:**
- Large download (10+ GB)
- Requires VirtualBox
- May be outdated

## Best Practices for Development

### 1. Use Version Control for APEX Apps

Export your applications regularly:

1. Navigate to **App Builder**
2. Select your application
3. Click **Export/Import → Export**
4. Save the SQL file to your repository

### 2. Separate Workspaces for Each Project

Create a dedicated workspace for each APEX application you're migrating.

### 3. Regular Backups

```bash
# Backup database
docker exec apex-db bash -c "expdp system/Oracle123!@XE full=y directory=DATA_PUMP_DIR dumpfile=backup.dmp"

# Copy backup out of container
docker cp apex-db:/opt/oracle/oradata/backup.dmp ./backup.dmp
```

### 4. Monitor Resource Usage

```bash
# Check container stats
docker stats apex-db

# Check database size
docker exec -it apex-db sqlplus sys/Oracle123!@XE as sysdba <<EOF
SELECT SUM(bytes)/1024/1024/1024 AS size_gb 
FROM dba_data_files;
exit
EOF
```

### 5. Keep APEX Updated

Regularly check for APEX updates:
- [APEX Downloads](https://www.oracle.com/tools/downloads/apex-downloads.html)
- [APEX Release Notes](https://docs.oracle.com/en/database/oracle/apex/24.2/htmrn/)

## Useful Commands

### Container Management

```bash
# Start APEX
docker-compose up -d

# Stop APEX
docker-compose stop

# Restart APEX
docker-compose restart

# View logs
docker-compose logs -f

# Remove container (keeps data)
docker-compose down

# Remove container and data
docker-compose down -v
```

### Database Access

```bash
# SQL*Plus as SYS
docker exec -it apex-db sqlplus sys/Oracle123!@XE as sysdba

# SQL*Plus as SYSTEM
docker exec -it apex-db sqlplus system/Oracle123!@XE

# Connect to specific schema
docker exec -it apex-db sqlplus MY_SCHEMA/password@XE
```

### APEX Administration

```bash
# Check APEX version
docker exec -it apex-db sqlplus / as sysdba <<EOF
SELECT version_no FROM apex_release;
exit
EOF

# List workspaces
docker exec -it apex-db sqlplus / as sysdba <<EOF
SELECT workspace, workspace_id FROM apex_workspaces;
exit
EOF

# Reset ADMIN password
docker exec -it apex-db sqlplus / as sysdba <<EOF
@/opt/oracle/apex/apxchpwd.sql
exit
EOF
```

## Next Steps

After setting up your Oracle APEX instance:

1. **Import Sample Applications**: Oracle provides sample apps to explore APEX features
2. **Review the Migration Guide**: Check out [../.github/agents/apex-to-dotnet-migration-guide.md](../.github/agents/apex-to-dotnet-migration-guide.md)
3. **Create a Test Application**: Build a simple APEX app to understand the framework
4. **Start Migration Planning**: Use the workflow inventory approach described in our guides

## Additional Resources

- [Oracle APEX Documentation](https://docs.oracle.com/en/database/oracle/apex/24.2/)
- [APEX Community Forum](https://community.oracle.com/tech/developers/categories/application-express)
- [APEX API Reference](https://docs.oracle.com/en/database/oracle/apex/24.2/aeapi/)
- [ApexToDotNet Migration Guide](../.github/agents/apex-to-dotnet-migration-guide.md)
- [Oracle Learning Library - APEX](https://apexapps.oracle.com/pls/apex/f?p=44785:1)

## Support

For issues with this setup:
- Check the [Troubleshooting](#troubleshooting) section
- Review Docker logs: `docker-compose logs`
- Open an issue in this repository

For Oracle APEX issues:
- [Oracle Support](https://support.oracle.com)
- [APEX Community Forum](https://community.oracle.com/tech/developers/categories/application-express)

# Oracle APEX Setup - Troubleshooting & Solutions

## Issue Summary

The Oracle Database 21c XE Docker image does **NOT** include Oracle APEX or ORDS pre-installed. These need to be installed separately, which is a complex and resource-intensive process, especially on Apple Silicon (ARM64) machines running AMD64 images through emulation.

## Root Cause

- Oracle XE image: `container-registry.oracle.com/database/express:21.3.0-xe` 
- Contains: Oracle Database 21c Express Edition only
- Does NOT contain: APEX or ORDS
- Installation failed due to: Resource constraints during APEX installation on emulated ARM64 platform

## Recommended Solutions

### Option 1: Use Oracle's Official APEX Container (Recommended)

Oracle provides standalone APEX/ORDS containers, but they require Oracle Database running separately.

**Setup:**
```bash
# Pull the ORDS container
docker pull container-registry.oracle.com/database/ords:latest

# This approach requires more complex networking between DB and ORDS containers
```

### Option 2: Build Custom Image with APEX Pre-installed

Create a Dockerfile that extends Oracle XE and includes APEX:

```dockerfile
FROM container-registry.oracle.com/database/express:21.3.0-xe

# Download and install APEX during image build
RUN curl -o /tmp/apex.zip https://download.oracle.com/otn_software/apex/apex_24.2.zip && \
    cd /tmp && unzip apex.zip && \
    cd apex && \
    echo exit | sqlplus / as sysdba @apexins.sql SYSAUX SYSAUX TEMP /i/

# Install and configure ORDS
...
```

**Note:** This takes 20-30 minutes to build.

### Option 3: Manual Installation After Container Start

Install APEX manually once the database is running (what we attempted):

```bash
# Start Oracle XE
docker-compose up -d

# Wait for database to be ready (2-3 minutes)

# Install APEX (requires 10-15 minutes + 2GB RAM)
./install-apex.sh
```

**Issue:** Failed on Apple Silicon due to resource constraints during emulation.

### Option 4: Use Cloud-Based Oracle APEX (Easiest!)

Oracle offers free APEX workspaces in the cloud:

1. Go to: https://apex.oracle.com/
2. Click "Get Started for Free"
3. Create a free workspace
4. **Pros:** Instant access, no local resources, latest APEX version
5. **Cons:** Requires internet, cloud-only

### Option 5: Oracle VM VirtualBox with Pre-built Database

Download Oracle's pre-built VM with APEX:

1. Download: [Oracle Database App Development VM](https://www.oracle.com/database/technologies/databaseappdev-vm.html)
2. Import into VirtualBox
3. **Pros:** Everything pre-configured, works on any platform
4. **Cons:** Large download (~10GB), requires VirtualBox

## Quick Workaround for Testing

If you just need to understand APEX for migration purposes:

### Use Oracle APEX Sandbox (Free, Instant)
- URL: https://apex.oracle.com
- Sign up for a free workspace
- Full APEX functionality
- No installation needed

## What Worked

✅ Docker Desktop installed  
✅ Oracle XE Database 21c running  
✅ Database accessible on port 1521  

## What Didn't Work

❌ APEX installation (not included in base image)  
❌ ORDS configuration (requires APEX first)  
❌ Web interface access on port 8080  

## Next Steps - Your Choice

**Recommended for immediate start:**
1. Use https://apex.oracle.com (cloud workspace)
2. Or use the VM download option
3. Continue with migration guide using cloud APEX

**For local development:**
1. Build custom Docker image with APEX (20-30 min one-time)
2. Or wait for Oracle to release official all-in-one image
3. Or use a more powerful x86_64 machine (non-Apple Silicon)

## Files Created

- `install-apex.sh` - Manual installation script (can be reused)
- `docker-compose-apex-prebuilt.yml` - Alternative compose file
- `CONNECTION_INFO.md` - Database connection details
- This file: `APEX_SETUP_TROUBLESHOOTING.md`

## Current Database Status

✅ **Oracle Database 21c XE**  
- Host: localhost  
- Port: 1521  
- Service: XE  
- Password: Oracle123!  
- Status: Running and healthy  

You can connect SQL clients to this database and use it for testing, even without APEX web interface.

## SQL Developer Connection

If you have Oracle SQL Developer or similar:
```
Hostname: localhost
Port: 1521
Service name: XEPDB1
Username: SYSTEM
Password: Oracle123!
```

## Questions?

Let me know which option you'd like to pursue, and I can help you set it up!

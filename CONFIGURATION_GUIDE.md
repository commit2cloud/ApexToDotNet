# Configuration Setup Guide

This guide explains how to configure the ApexToDotNet application with your Oracle APEX instance.

---

## 🔐 Security Notice

**IMPORTANT**: Never commit actual passwords, connection strings, or secrets to version control!

---

## 📝 Configuration Files

### 1. Environment Variables (Recommended)

Create a `.env` file in the project root (this file is gitignored):

```bash
# Copy from template
cp .env.oci.template .env
```

Then edit `.env` with your actual values:

```bash
# Oracle APEX Instance
APEX_OCI_URL=https://your-instance.adb.your-region.oraclecloudapps.com
APEX_WORKSPACE=your_workspace_name
APEX_APP_ID=100
APEX_USERNAME=your_apex_username
APEX_PASSWORD=your_apex_password

# Oracle Database Connection
OCI_DB_HOST=your-instance.adb.your-region.oraclecloudapps.com
OCI_DB_PORT=1522
OCI_DB_SERVICE_NAME=your_service_name.adb.oraclecloud.com
OCI_DB_USERNAME=ADMIN
OCI_DB_PASSWORD=your_actual_password

# ORDS REST API
ORDS_BASE_URL=https://your-instance.adb.your-region.oraclecloudapps.com/ords/your_workspace
```

### 2. Application Settings (Alternative)

Create `appsettings.Development.json` in `ApexToDotNet.API/` folder (this file is gitignored):

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "OracleAPEX": "User Id=ADMIN;Password=YOUR_ACTUAL_PASSWORD;Data Source=(DESCRIPTION=(RETRY_COUNT=3)(RETRY_DELAY=3)(ADDRESS=(PROTOCOL=TCPS)(PORT=1522)(HOST=your-instance.adb.your-region.oraclecloudapps.com))(CONNECT_DATA=(SERVICE_NAME=your_service_name.adb.oraclecloud.com))(SECURITY=(SSL_SERVER_DN_MATCH=YES)))"
  },
  "ApexSettings": {
    "BaseUrl": "https://your-instance.adb.your-region.oraclecloudapps.com/ords",
    "WorkspaceId": "your_workspace",
    "ApplicationId": "100",
    "OrdsBaseUrl": "https://your-instance.adb.your-region.oraclecloudapps.com/ords/your_workspace",
    "Username": "your_apex_username",
    "Password": "your_apex_password"
  }
}
```

---

## 🔍 Finding Your OCI Connection Details

### Option 1: OCI Console
1. Go to OCI Console → Autonomous Database
2. Click your database name
3. Click "DB Connection"
4. Copy the connection string details

### Option 2: APEX SQL Workshop
1. Login to APEX
2. Go to SQL Workshop → SQL Commands
3. Run: `SELECT * FROM V$DATABASE;`
4. Run: `SELECT * FROM V$INSTANCE;`

---

## ✅ Verify Configuration

After setting up, test your connection:

```bash
# Start the API
cd ApexToDotNet.API
dotnet run

# Check health endpoint
curl http://localhost:5000/api/health
```

---

## 🚨 Security Checklist

Before committing code:

- [ ] `.env` file is NOT committed (check .gitignore)
- [ ] `appsettings.Development.json` is NOT committed
- [ ] No actual passwords in `appsettings.json` (only placeholders)
- [ ] No hardcoded credentials in source code
- [ ] Template files (`.env.example`, `.env.oci.template`) only have placeholders

---

## 📚 More Information

See:
- [OCI_APEX_CONNECTION.md](OCI_APEX_CONNECTION.md) - Detailed OCI setup guide
- [ORDS_ENDPOINTS_GUIDE.md](ORDS_ENDPOINTS_GUIDE.md) - Setting up REST endpoints
- [GETTING_STARTED.md](GETTING_STARTED.md) - Complete getting started guide

---

**Remember**: Keep your credentials secure! Use environment variables or secure configuration management in production.

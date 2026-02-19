# Oracle OCI APEX Connection Configuration

## Overview
This project now connects to an Oracle APEX application hosted in Oracle Cloud Infrastructure (OCI).

## Connection Details

### APEX Application
- **Environment**: Oracle Cloud Infrastructure (OCI)
- **APEX Instance URL**: `https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords`
- **Full App URL**: `https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/r/apexdotnet/strategic-planner/home`
- **Workspace**: `apexdotnet`
- **Application ID**: `102`
- **Application Name**: `Strategic Planner`
- **Region**: `us-chicago-1`

### Database Connection
**Database ID**: `dbqp49l` (from URL)
**Region**: `us-chicago-1`
**Service Name**: `G5F6A9F954550CC_DBQP49L_low.adb.oraclecloud.com`
**Host**: `g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com`
**Port**: `1522` (TCPS/TLS)
**Connection Type**: TLS (no wallet required)

#### Easy Connect String
```
tcps://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com:1522/G5F6A9F954550CC_DBQP49L_low.adb.oraclecloud.com
```

#### TNS Connection String
```
(DESCRIPTION=(RETRY_COUNT=3)(RETRY_DELAY=3)(ADDRESS=(PROTOCOL=TCPS)(PORT=1522)(HOST=g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com))(CONNECT_DATA=(SERVICE_NAME=G5F6A9F954550CC_DBQP49L_low.adb.oraclecloud.com))(SECURITY=(SSL_SERVER_DN_MATCH=YES)))
```

#### Credentials
- **Username**: `ADMIN` (or your workspace schema user)
- **Password**: [Set in `.env` file]

#### For ApexToDotNet.API
Edit: `ApexToDotNet.API/appsettings.json`
```json
{
  "ConnectionStrings": {
    "OracleAPEX": "Data Source=<OCI_CONNECTION_STRING>;User Id=<USERNAME>;Password=<PASSWORD>;"
  },
  "ApexSettings": {
    "BaseUrl": "<APEX_INSTANCE_URL>",
    "WorkspaceId": "<WORKSPACE_ID>",
    "ApplicationId": "<APP_ID>"
  }
}
```

#### Environment Variables
Create/update `.env` file with OCI credentials:
```bash
# Oracle OCI APEX Connection
APEX_OCI_URL=https://your-instance.apex.oraclecloud.com
APEX_WORKSPACE=your_workspace
APEX_USERNAME=your_username
APEX_PASSWORD=your_password

# Oracle Database Connection
OCI_DB_CONNECTION_STRING=your_connection_string
OCI_DB_USERNAME=your_db_username
OCI_DB_PASSWORD=your_db_password
```

## REST Data Services (ORDS) Endpoints

### Base ORDS URL
```
https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords
```

### Workspace REST Base
```
https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet
```

### Auto-generated Endpoints
APEX typically creates REST endpoints at:
```
https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords/apexdotnet/<schema>/
```

### Custom REST Endpoints
Document any custom REST Data Sources or Web Services you create in APEX.

## Next Steps

1. ✅ Clean up local Docker files (COMPLETE)
2. ⏳ Finish creating OCI APEX application
3. ⏳ Get connection details from OCI
4. ⏳ Update connection strings
5. ⏳ Test connectivity from local .NET API
6. ⏳ Update Angular app to point to local API

## Security Notes

- **Never commit credentials** to the repository
- Use `.env` file for local development (already in `.gitignore`)
- For production, use OCI Vault or similar secrets management
- Consider using OCI API Gateway for additional security layer

## Testing Connection

Once configured, test the connection:

```bash
# Test from .NET API
cd ApexToDotNet.API
dotnet run

# Check if API can connect to OCI APEX
curl http://localhost:5000/api/health
```

## Troubleshooting

### Common Issues

1. **Firewall/Network Issues**
   - Ensure OCI security lists allow incoming connections
   - Check if your local network can reach OCI endpoints

2. **Authentication Issues**
   - Verify workspace name matches exactly (case-sensitive)
   - Check APEX user has necessary privileges

3. **CORS Issues**
   - Configure ORDS to allow requests from localhost during development
   - Update CORS settings in OCI APEX

## Reference Documentation

- [Oracle APEX Cloud Documentation](https://docs.oracle.com/en/cloud/paas/apex/)
- [ORDS REST APIs](https://docs.oracle.com/en/database/oracle/oracle-rest-data-services/)
- [OCI Database Cloud Service](https://docs.oracle.com/en-us/iaas/Content/Database/home.htm)

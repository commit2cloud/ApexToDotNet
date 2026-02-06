# Oracle APEX Instance - Connection Information

## ✅ Status: RUNNING & HEALTHY

Your Oracle APEX Docker instance has been successfully created and started!

---

## 🌐 Web Access

### APEX Administration Interface
- **URL**: http://localhost:8080/ords/apex_admin
- **Workspace**: INTERNAL
- **Username**: ADMIN
- **Password**: Oracle123!

⚠️ **IMPORTANT**: Change the default password immediately after first login!

### APEX Main URL
- **URL**: http://localhost:8080/ords

---

## 🗄️ Database Connection

### Database Details
- **Host**: localhost
- **Port**: 1521
- **Service Name**: XE
- **SID**: XE
- **Version**: Oracle Database 21c Express Edition

### Connection String
```
localhost:1521/XE
```

### Default Credentials
- **System User**: SYS / SYSTEM
- **Password**: Oracle123!

---

## 📊 Enterprise Manager Express

- **URL**: http://localhost:5500/em
- **Username**: SYS (as SYSDBA) or SYSTEM
- **Password**: Oracle123!

---

## 🐳 Docker Management

### View Logs
```bash
cd /Users/commit2cloud/ApexToDotNet
docker-compose logs -f
```

### Stop APEX
```bash
docker-compose stop
```

### Start APEX
```bash
docker-compose start
```

### Restart APEX
```bash
docker-compose restart
```

### View Status
```bash
docker-compose ps
```

### Remove Everything (including data volumes)
```bash
docker-compose down -v
```

---

## 📁 Persistent Storage

Data is stored in Docker volumes:
- **oracle-data**: Database files
- **ords-config**: ORDS configuration

These volumes persist even when the container is stopped, ensuring your data is safe.

---

## 🔧 Container Information

- **Container Name**: apex-db
- **Container ID**: 7fae95f18df4
- **Status**: Up and running (healthy)
- **Image**: container-registry.oracle.com/database/express:21.3.0-xe
- **Platform**: linux/amd64 (running on arm64 with Rosetta emulation)

---

## 📚 Next Steps

1. **Access APEX Admin**: Open http://localhost:8080/ords/apex_admin
2. **Login with default credentials** (INTERNAL/ADMIN/Oracle123!)
3. **Change the password** immediately
4. **Create a workspace** for your applications
5. **Review the migration guide**: See `.github/agents/apex-to-dotnet-migration-guide.md`

---

## 🆘 Troubleshooting

### Container not responding?
```bash
docker-compose restart
docker-compose logs -f
```

### Port already in use?
Edit `.env` file or `docker-compose.yml` to change port mappings.

### Need to start fresh?
```bash
docker-compose down -v
docker-compose up -d
```

---

## 📖 Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [Full APEX Setup Guide](docs/oracle-apex-setup.md)
- [Migration Guide](.github/agents/apex-to-dotnet-migration-guide.md)

---

**Created**: February 6, 2026
**Docker Desktop**: Version 29.2.0
**Location**: /Users/commit2cloud/ApexToDotNet

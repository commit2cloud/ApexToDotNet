# Quick Start Guide - Oracle APEX Setup

Get Oracle APEX running on your machine in minutes!

## Prerequisites

- Docker Desktop installed and running
- At least 8 GB RAM and 20 GB disk space available

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/github/ApexToDotNet.git
cd ApexToDotNet
```

### 2. Start Oracle APEX

```bash
docker-compose up -d
```

### 3. Wait for Initialization (5-10 minutes)

Monitor the startup:

```bash
docker-compose logs -f
```

Look for: `DATABASE IS READY TO USE!`

### 4. Access APEX

Open your browser:
- **APEX URL:** http://localhost:8080/ords
- **Admin Interface:** http://localhost:8080/ords/apex_admin

### 5. Login

Default credentials:
- **Workspace:** INTERNAL
- **Username:** ADMIN
- **Password:** Oracle123!

⚠️ **IMPORTANT:** Change the password immediately after first login!

## What's Next?

1. **Create Your First Workspace**
   - Navigate to the Admin interface
   - Click "Create Workspace"
   - Follow the wizard

2. **Import Sample Apps**
   - APEX includes sample applications
   - Great for learning and testing

3. **Review Migration Guide**
   - See [APEX to .NET Migration Guide](../.github/agents/apex-to-dotnet-migration-guide.md)
   - Understand the migration workflow approach

## Common Commands

```bash
# View logs
docker-compose logs -f

# Stop APEX
docker-compose stop

# Start APEX
docker-compose start

# Restart APEX
docker-compose restart

# Remove everything (including data)
docker-compose down -v
```

## Need Help?

- **Full Documentation:** [docs/oracle-apex-setup.md](docs/oracle-apex-setup.md)
- **Troubleshooting:** See the troubleshooting section in the full guide
- **Init Scripts:** [init-scripts/README.md](init-scripts/README.md)

## Troubleshooting Quick Fixes

### Port Already in Use

```bash
docker-compose down
# Edit docker-compose.yml and change port 8080 to another port
docker-compose up -d
```

### Container Won't Start

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Start fresh
```

### Database Taking Too Long

First startup can take 10+ minutes. Be patient and watch the logs:

```bash
docker-compose logs -f apex-db
```

## Configuration

To customize your setup:

1. Copy `.env.example` to `.env`
2. Edit `.env` with your preferred settings
3. Restart: `docker-compose down && docker-compose up -d`

## System Requirements

- **OS:** Windows 10+, macOS 10.15+, or Linux
- **RAM:** 8 GB minimum (16 GB recommended)
- **Disk:** 20 GB free space
- **Docker:** Docker Desktop 4.0+ or Docker Engine 20.10+

---

📚 For comprehensive documentation, troubleshooting, and advanced configuration, see the [full setup guide](docs/oracle-apex-setup.md).

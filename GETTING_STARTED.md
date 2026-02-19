# Getting Started with ApexToDotNet

**Strategic Planner** - Angular/.NET application connected to Oracle APEX

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- ✅ .NET 10 SDK installed
- ✅ Node.js 18+ and npm installed
- ✅ Oracle APEX app in OCI (Strategic Planner - App 102)

### 1. Start the .NET API

```bash
cd /Users/commit2cloud/ApexToDotNet/ApexToDotNet.API
dotnet restore
dotnet run
```

The API will start on **http://localhost:5000**

### 2. Start the Angular App

Open a **new terminal**:

```bash
cd /Users/commit2cloud/ApexToDotNet/ApexToDotNet.Web
npm install
ng serve
```

The app will start on **http://localhost:4200**

### 3. Open in Browser

Navigate to **http://localhost:4200**

You should see the Strategic Planner application with:
- ✅ Blue header bar with "Strategic Planner" title
- ✅ Left sidebar navigation
- ✅ Home dashboard with statistics
- ✅ Projects, Activities, People, and other pages

---

## 📋 What's Implemented

### ✅ Frontend (Angular 17)
- **Home Dashboard** - Overview with statistics and recent items
- **Projects** - Enhanced list view with filters, search, and card layout
- **Project Detail** - Full project view with tabs, comments, and activity timeline
- **Activities** - List and management
- **People** - Team member management
- **Sessions** - Calendar view and session management
- **Navigation** - Responsive sidebar with dynamic counts (when ORDS connected)

### ✅ Backend (.NET 10 API)
- **ProjectsController** - CRUD operations for projects
- **SessionsController** - Session management
- **TasksController** - Task management
- **OrdsApiClient** - Connector for APEX REST endpoints

### ⏳ In Progress
- **ORDS Integration** - Connecting to APEX REST endpoints for live data
- **Additional Features** - Person Groups, Releases, Project Groups

---

## 🔌 Next Steps: Connect to APEX Data

To connect your Angular app to the APEX database, follow the **[ORDS Endpoints Guide](ORDS_ENDPOINTS_GUIDE.md)**.

This guide shows you how to:
1. Create REST endpoints in APEX
2. Configure ORDS authentication
3. Update the .NET API with ORDS URLs
4. Test the end-to-end connection

**Estimated time**: 30-60 minutes

---

## 📖 Documentation

### Setup Guides
- **[OCI APEX Connection](OCI_APEX_CONNECTION.md)** - Configure connection to Oracle Cloud APEX
- **[Getting Started with Cloud APEX](GETTING_STARTED_CLOUD_APEX.md)** - Using APEX in Oracle Cloud
- **[ORDS Endpoints Guide](ORDS_ENDPOINTS_GUIDE.md)** - Create REST endpoints in APEX

### Implementation Docs
- **[Running the App](RUNNING_THE_APP.md)** - Detailed instructions for running frontend and backend
- **[Component Patterns](COMPONENT_PATTERNS.md)** - Angular component architecture
- **[Projects Expansion](PROJECTS_EXPANSION_SUMMARY.md)** - Recent Projects feature expansion
- **[Strategic Planner Analysis](STRATEGIC_PLANNER_ANALYSIS.md)** - APEX app structure analysis

### Migration & Architecture
- **[Migration Guide](.github/agents/apex-to-dotnet-migration-guide.md)** - Comprehensive APEX to .NET migration strategy
- **[Quick Reference](QUICK_REFERENCE.md)** - Technology stack and quick commands

---

## 🛠️ Troubleshooting

### Angular won't start
```bash
cd ApexToDotNet.Web
rm -rf node_modules package-lock.json
npm install
ng serve
```

### .NET API won't start
```bash
cd ApexToDotNet.API
dotnet clean
dotnet restore
dotnet build
dotnet run
```

### Browser shows cached old version
- **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Clear cache**: Open DevTools (F12) → Application → Clear storage
- **Try Incognito**: Open in a new incognito/private window

### Port already in use
```bash
# Find what's using the port
lsof -i :4200  # or :5000

# Kill the process
kill -9 <PID>
```

---

## 📁 Project Structure

```
ApexToDotNet/
├── ApexToDotNet.API/          # .NET 10 Web API
│   ├── Controllers/           # REST API controllers
│   ├── Models/                # Data models
│   └── Services/              # Business logic
│
├── ApexToDotNet.Web/          # Angular 17 Frontend
│   └── src/
│       └── app/
│           ├── features/      # Feature components
│           │   ├── projects/  # Projects (enhanced)
│           │   ├── sessions/  # Sessions & Calendar
│           │   ├── activities/
│           │   └── people/
│           ├── models/        # TypeScript interfaces
│           ├── services/      # API services
│           └── layout/        # Layout components
│
├── apex-exports/              # APEX SQL exports
├── docs/                      # Documentation
└── screenshots/               # UI screenshots
```

---

## 🎯 Current State

**Version**: v0.2-alpha  
**Status**: Development  
**APEX App**: Strategic Planner (App 102)  
**Workspace**: apexdotnet  
**Environment**: Oracle Cloud Infrastructure (OCI)

### Recent Updates
- ✅ Enhanced Projects list with sidebar filters, search, and card layout
- ✅ New Project detail page with tabs, comments, and activity timeline
- ✅ Improved navigation and layout components
- ✅ Updated branding to "Strategic Planner"

### Next Priorities
1. Complete ORDS REST endpoints in APEX
2. Connect Angular to live data via ORDS
3. Implement remaining features (Person Groups, Releases)
4. Add authentication and authorization

---

## 💡 Tips

- **Use the Screenshots**: The `screenshots/` folder has examples from the APEX app
- **Check APEX First**: When in doubt, look at the APEX app to see the expected behavior
- **Mock Data**: Components currently use mock data - this will be replaced with ORDS calls
- **Incremental**: Focus on one workflow at a time, test thoroughly before moving on

---

## 📞 Support

For questions or issues:
1. Check the documentation in the `docs/` folder
2. Review the [Migration Guide](.github/agents/apex-to-dotnet-migration-guide.md)
3. Look at [APEX App Info](APEX_APP_INFO.md) for APEX-specific details
4. Contact the migration team

---

**Ready to build?** Start with the [ORDS Endpoints Guide](ORDS_ENDPOINTS_GUIDE.md) to connect your app to live data! 🚀

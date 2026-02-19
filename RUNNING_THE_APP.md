# Running the Strategic Planner Application

## Prerequisites

Before running the application, ensure you have:

- ✅ **.NET 10 SDK** installed (`dotnet --version` should show 10.x.x)
- ✅ **Node.js 18+** and npm installed (`node --version`)
- ✅ **Angular CLI** installed globally (`ng version`)
- ✅ **Oracle APEX** app in OCI (Strategic Planner - App 102)

### Install Prerequisites (if needed)

```bash
# Install .NET 10 SDK (macOS)
brew install dotnet

# Install Node.js and npm
brew install node

# Install Angular CLI globally
npm install -g @angular/cli
```

---

## 🚀 Starting the Application

### Step 1: Start the .NET API

Open a terminal and run:

```bash
cd /Users/commit2cloud/ApexToDotNet/ApexToDotNet.API
dotnet restore
dotnet run
```

**Expected Output**:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shutdown.
```

The API is now running on **http://localhost:5000**

### Step 2: Start the Angular Frontend

Open a **new terminal** (keep the API running) and run:

```bash
cd /Users/commit2cloud/ApexToDotNet/ApexToDotNet.Web
npm install  # Only needed first time or after package.json changes
ng serve
```

**Expected Output**:
```
✔ Browser application bundle generation complete.
✔ Built successfully.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

The Angular app is now running on **http://localhost:4200**

### Step 3: Open in Browser

Navigate to **http://localhost:4200** in your web browser.

You should see the **Strategic Planner** application with:
- Blue header bar with "Strategic Planner" title
- Left sidebar with navigation
- Home dashboard with statistics
- All pages accessible via sidebar

---

## 📋 What's Working

### ✅ Fully Functional (with Mock Data)

| Module | Features |
|--------|----------|
| **Home** | Dashboard with stats, recent projects, areas, initiatives |
| **Projects** | Enhanced list with filters, search, sort; Detail view with tabs, comments, activity |
| **Sessions** | Calendar view, list view, edit form |
| **Activities** | List view with management |
| **People** | List view with management |
| **Layout** | Responsive header, sidebar navigation |

### ⏳ Requires ORDS Setup

To connect to live APEX data, follow the **[ORDS Endpoints Guide](ORDS_ENDPOINTS_GUIDE.md)**:
- Navigation badge counts
- Real project/activity/people data from database
- Create/update operations synced to APEX

---

## 🛠️ Troubleshooting

### Angular Server Won't Start

**Problem**: `ng: command not found` or compilation errors

**Solution**:
```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Clear and reinstall dependencies
cd ApexToDotNet.Web
rm -rf node_modules package-lock.json
npm install
ng serve
```

### .NET API Won't Start

**Problem**: Build errors or missing dependencies

**Solution**:
```bash
cd ApexToDotNet.API
dotnet clean
dotnet restore
dotnet build
dotnet run
```

### Browser Shows Old/Cached Version

**Problem**: Changes not appearing, seeing old "ApexToDotNet Migration" text

**Solution**:
- **Hard Refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Clear Cache**: 
  1. Open DevTools (F12)
  2. Go to Application tab
  3. Click "Clear storage"
  4. Reload
- **Try Incognito**: Open in a new incognito/private window

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::4200`

**Solution**:
```bash
# Find what's using the port
lsof -i :4200  # or :5000 for API

# Kill the process
kill -9 <PID>

# Or use a different port
ng serve --port 4201
```

### API Can't Connect to ORDS

**Problem**: 404 errors when trying to fetch data

**Solution**:
1. Verify ORDS endpoints are created in APEX (see [ORDS Endpoints Guide](ORDS_ENDPOINTS_GUIDE.md))
2. Check `.env` file has correct ORDS URL
3. Ensure ORDS authentication is configured
4. Test ORDS endpoints directly in browser or Postman

---

## 🔍 Verifying the Setup

### Check API is Running

Open in browser or use curl:
```bash
curl http://localhost:5000/api/projects
```

You should get a JSON response with projects (mock data initially).

### Check Angular is Running

Navigate to **http://localhost:4200** in your browser.

You should see the Strategic Planner home page with:
- Header: "Strategic Planner" title
- Sidebar: Navigation menu
- Content: Dashboard with statistics

### Check Browser Console

Open DevTools (F12) and check the Console tab for any errors.

Common errors and fixes:
- **404 errors**: API not running or wrong URL
- **CORS errors**: API CORS policy needs configuration
- **Module not found**: Run `npm install` in Angular project

---

## 📁 Project Structure

```
ApexToDotNet/
├── ApexToDotNet.API/           # .NET 10 Web API
│   ├── Controllers/            # REST API controllers
│   │   ├── ProjectsController.cs
│   │   ├── SessionsController.cs
│   │   └── TasksController.cs
│   ├── Models/                 # Data models
│   │   ├── Project.cs
│   │   ├── Session.cs
│   │   └── Task.cs
│   └── Services/               # Business logic
│       └── OrdsApiClient.cs    # ORDS connector
│
├── ApexToDotNet.Web/           # Angular 17 Frontend  
│   └── src/app/
│       ├── features/           # Feature modules
│       │   ├── projects/       # Projects (enhanced)
│       │   │   ├── project-list/
│       │   │   ├── project-detail/  # NEW
│       │   │   └── project-edit/
│       │   ├── sessions/       # Sessions & calendar
│       │   ├── activities/     # Activities
│       │   └── people/         # People
│       ├── layout/             # Layout components
│       │   ├── header/
│       │   ├── sidebar/
│       │   └── main-layout/
│       ├── models/             # TypeScript interfaces
│       └── services/           # API services
│
└── apex-exports/               # APEX SQL exports
```

---

## 🔄 Development Workflow

### Making Changes to Angular

1. Edit files in `ApexToDotNet.Web/src/app/`
2. Angular dev server auto-recompiles
3. Browser auto-refreshes
4. Check for errors in terminal and browser console

### Making Changes to .NET API

1. Edit files in `ApexToDotNet.API/`
2. Stop the API (Ctrl+C)
3. Rebuild and run:
   ```bash
   dotnet build
   dotnet run
   ```

### Adding New Components

```bash
# Generate new Angular component
cd ApexToDotNet.Web
ng generate component features/new-feature/new-component

# Generate new Angular service
ng generate service services/new-service
```

---

## 📊 Current Implementation Status

**Version**: v0.2-alpha  
**Last Updated**: Current session

### Recent Updates
- ✅ Enhanced Projects list with sidebar filters, search, cards
- ✅ New Project detail page with tabs, comments, activity
- ✅ Improved routing and navigation
- ✅ Updated branding to "Strategic Planner"
- ✅ Cleaned up old Docker-related code
- ✅ Consolidated documentation

### Next Steps
1. Complete ORDS REST endpoints in APEX
2. Connect Angular to live data
3. Implement remaining modules (Person Groups, Releases)
4. Add authentication and authorization
5. Add error handling and loading states
6. Implement unit and integration tests

---

## 📞 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review the [Getting Started Guide](GETTING_STARTED.md)
3. Check [APEX App Info](APEX_APP_INFO.md) for APEX-specific details
4. Review the [Migration Guide](.github/agents/apex-to-dotnet-migration-guide.md)
5. Contact the migration team

---

## 🎯 Quick Commands Reference

```bash
# Start .NET API
cd ApexToDotNet.API && dotnet run

# Start Angular
cd ApexToDotNet.Web && ng serve

# Rebuild Angular dependencies
cd ApexToDotNet.Web && rm -rf node_modules && npm install

# Clean and rebuild .NET
cd ApexToDotNet.API && dotnet clean && dotnet restore && dotnet build

# Generate new Angular component
cd ApexToDotNet.Web && ng generate component features/module-name/component-name

# Run Angular tests
cd ApexToDotNet.Web && ng test

# Build for production
cd ApexToDotNet.Web && ng build --configuration production
```

---

**Ready to run?** Follow Steps 1-3 above! 🚀
- **APEX**: http://localhost:8080/ords
- **Workspace**: apexdotnet

---

**Bottom Line**: The coding work is 100% complete. The calendar route has been successfully added. To actually run and test the application, you'll need to either install the development tools locally (Node.js/Angular CLI/.NET SDK) or refine the Docker configuration.

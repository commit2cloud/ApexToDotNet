# ApexToDotNet

**Strategic Planner** - Proof of Concept for migrating Oracle APEX applications to Angular/.NET architecture

---

## 🎯 What is This?

This POC demonstrates a **modern approach to migrating Oracle APEX applications** to an Angular 17 frontend with a .NET 10 Web API backend. It showcases:

- ✅ **Enhanced UI/UX** - Modern, responsive design matching APEX functionality
- ✅ **Incremental Migration** - Strangler Fig pattern for low-risk transitions
- ✅ **Real-world Features** - Projects, Sessions, Activities, and People modules
- ✅ **Clean Architecture** - Separation of concerns, testable code
- ✅ **ORDS Ready** - Designed to connect to APEX via REST endpoints

---

## 🚀 Try It Yourself (5 Minutes)

### Step 1: Install Prerequisites

- **[.NET 10 SDK](https://dotnet.microsoft.com/download)** - Backend runtime
- **[Node.js 18+](https://nodejs.org/)** - Frontend runtime
- **[Git](https://git-scm.com/)** - Version control

### Step 2: Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd ApexToDotNet

# Install Angular CLI globally
npm install -g @angular/cli
```

### Step 3: Configure Connection (Optional for Demo)

To connect to your APEX instance:

```bash
# Copy the template
cp .env.oci.template .env

# Edit .env with your APEX connection details
# See CONFIGURATION_GUIDE.md for help
```

**Note**: The app works with **mock data** out of the box - no APEX connection needed for initial demo!

### Step 4: Start the Application

**Terminal 1 - Start the API:**
```bash
cd ApexToDotNet.API
dotnet restore
dotnet run
```

**Terminal 2 - Start the Frontend:**
```bash
cd ApexToDotNet.Web
npm install
ng serve
```

**Terminal 3 - Open in Browser:**
```bash
open http://localhost:4200
```

---

## ✅ What's Working (Demo Ready)

| Feature | Status | Description |
|---------|--------|-------------|
| **Home Dashboard** | ✅ Complete | Statistics cards, recent projects, quick actions |
| **Projects - List View** | ✅ Complete | Sidebar filters (Area, Initiative, Priority, Status), search, sort, card-based grid with badges and progress bars |
| **Projects - Detail View** | ✅ Complete | Comprehensive tabs (Comments, Activity, Description, Contributors, Milestones, Reviews, Tasks, Links, Documents), metadata header, timeline |
| **Projects - Edit Form** | ✅ Complete | Create and update projects |
| **Sessions - Calendar** | ✅ Complete | FullCalendar integration with month/week/day views |
| **Sessions - List View** | ✅ Complete | List with filters and management |
| **Activities Module** | ✅ Complete | List view with actions |
| **People Module** | ✅ Complete | Team member management |
| **Responsive Layout** | ✅ Complete | Header, sidebar navigation, mobile-friendly |
| **Routing & Navigation** | ✅ Complete | Full navigation between all modules |

### 🎨 Recent Enhancements

**Projects Module** (Latest Update):
- **Enhanced List Page**: Advanced filtering sidebar (Area, Initiative, Priority, Status), real-time search, multiple sort options, professional card grid layout with badges and progress indicators
- **New Detail Page**: Tabbed interface with 10 tabs (Comments, Activity, Description, Contributors, Milestones, Reviews, Tasks, Links, Documents, Related), comprehensive metadata header, activity timeline with timestamps
- **APEX-Matching UI**: Styling closely replicates Oracle APEX Strategic Planner interface

---

## 📋 What's TODO (Next Phase)

| Feature | Status | Notes |
|---------|--------|-------|
| **ORDS Integration** | 🔄 Ready | Infrastructure ready, needs ORDS endpoints created in APEX |
| **Live Data Connection** | 🔄 Pending | Currently uses mock data; See [ORDS_ENDPOINTS_GUIDE.md](ORDS_ENDPOINTS_GUIDE.md) |
| **Navigation Badge Counts** | 🔄 Pending | Requires ORDS connection for real-time counts |
| **Person Groups Module** | ⏳ Planned | Additional module to implement |
| **Releases Module** | ⏳ Planned | Additional module to implement |
| **Project Groups Module** | ⏳ Planned | Additional module to implement |
| **Authentication** | ⏳ Planned | JWT-based auth with APEX integration |
| **Authorization** | ⏳ Planned | Role-based access control |
| **Unit Tests** | ⏳ Planned | Frontend and backend test coverage |
| **Integration Tests** | ⏳ Planned | End-to-end testing |
| **Error Handling** | ⏳ Planned | Comprehensive error messages and logging |
| **Loading States** | ⏳ Planned | Better UX during data fetching |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Browser (User Interface)              │
└────────────────┬────────────────────────────────┘
                 │ HTTP (Port 4200)
┌────────────────▼────────────────────────────────┐
│         Angular 17 Frontend                     │
│  • Standalone Components                        │
│  • Responsive Design                            │
│  • FullCalendar Integration                     │
│  • TypeScript 5                                 │
└────────────────┬────────────────────────────────┘
                 │ REST API (Port 5000)
┌────────────────▼────────────────────────────────┐
│         .NET 10 Web API                         │
│  • Controllers (Projects, Sessions, Tasks)      │
│  • ORDS API Client                              │
│  • Health Check Endpoint                        │
└────────────────┬────────────────────────────────┘
                 │ ORDS REST (HTTPS)
┌────────────────▼────────────────────────────────┐
│         Oracle APEX (OCI)                       │
│  • REST Endpoints via ORDS                      │
│  • Business Logic                               │
│  • Data Validation                              │
└────────────────┬────────────────────────────────┘
                 │ SQL
┌────────────────▼────────────────────────────────┐
│         Oracle Autonomous Database              │
│  • Data Storage                                 │
│  • PL/SQL Procedures                            │
└─────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend**:
- Angular 17 (standalone components)
- TypeScript 5
- FullCalendar for scheduling
- Responsive CSS (no UI framework - custom styling)

**Backend**:
- .NET 10 Web API
- C# 12
- Oracle.ManagedDataAccess.Core
- Swagger/OpenAPI documentation

**Database & Integration**:
- Oracle Autonomous Database (OCI)
- Oracle APEX 24.2
- ORDS (Oracle REST Data Services)

---

## 📂 Project Structure

```
ApexToDotNet/
│
├── ApexToDotNet.API/              # .NET 10 Web API
│   ├── Controllers/               # REST API endpoints
│   │   ├── ProjectsController.cs  # Projects CRUD
│   │   ├── SessionsController.cs  # Sessions CRUD
│   │   ├── TasksController.cs     # Tasks CRUD
│   │   └── HealthController.cs    # Health checks
│   ├── Models/                    # Data models
│   │   ├── Project.cs
│   │   ├── Session.cs
│   │   └── Task.cs
│   ├── Services/                  # Business logic
│   │   └── OrdsApiClient.cs       # ORDS connector
│   └── appsettings.json           # Configuration (template)
│
├── ApexToDotNet.Web/              # Angular 17 Frontend
│   ├── src/app/
│   │   ├── features/              # Feature modules
│   │   │   ├── projects/          # Projects module
│   │   │   │   ├── project-list/     # Enhanced list with filters
│   │   │   │   ├── project-detail/   # Detail with tabs
│   │   │   │   └── project-edit/     # Create/edit form
│   │   │   ├── sessions/          # Sessions & Calendar
│   │   │   │   ├── calendar-view/    # FullCalendar
│   │   │   │   ├── session-list/     # List view
│   │   │   │   └── session-edit/     # Edit form
│   │   │   ├── activities/        # Activities module
│   │   │   └── people/            # People module
│   │   ├── layout/                # Layout components
│   │   │   ├── header/            # Top navigation
│   │   │   ├── sidebar/           # Side navigation
│   │   │   └── main-layout/       # Main wrapper
│   │   ├── models/                # TypeScript interfaces
│   │   └── services/              # API services
│   │       ├── project.service.ts
│   │       └── session.service.ts
│   ├── angular.json               # Angular config
│   └── package.json               # Dependencies
│
├── apex-exports/                  # APEX SQL exports
│   ├── schema.sql                 # Database schema
│   └── sampleapp.sql              # Sample data
│
├── docs/                          # Documentation
│   └── archive/                   # Historical docs
│
├── .env.example                   # Environment template
├── .env.oci.template              # OCI-specific template
└── .gitignore                     # Git exclusions
```

---

## 🔄 Migration Approach: Strangler Fig Pattern

This POC demonstrates the **Strangler Fig pattern** - a proven approach for low-risk, incremental migration:

### Phase 1: Both Systems Coexist
- APEX continues handling production traffic
- New Angular/.NET handles specific workflows
- Shared database ensures data consistency
- Users experience seamless transition

### Phase 2: Workflow-by-Workflow Migration
- Identify high-value workflows
- Implement in Angular/.NET with behavioral parity
- Test thoroughly with real users
- Redirect traffic workflow-by-workflow
- Keep APEX as fallback

### Phase 3: Complete Cutover
- All workflows migrated and validated
- APEX retired gracefully
- Database optimized for new architecture
- Legacy code removed

**Key Principle**: Migrate **workflows**, not **pages**. Focus on complete user journeys.

---

## 📖 Documentation

### For Getting Started
- **[GETTING_STARTED.md](GETTING_STARTED.md)** ⭐ - Complete setup guide (5 minutes)
- **[RUNNING_THE_APP.md](RUNNING_THE_APP.md)** - Detailed run instructions
- **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)** - Connect to your APEX instance
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands cheat sheet

### For APEX Integration
- **[ORDS_ENDPOINTS_GUIDE.md](ORDS_ENDPOINTS_GUIDE.md)** - Create REST endpoints in APEX
- **[OCI_APEX_CONNECTION.md](OCI_APEX_CONNECTION.md)** - OCI setup instructions
- **[GETTING_STARTED_CLOUD_APEX.md](GETTING_STARTED_CLOUD_APEX.md)** - Working with APEX in OCI

### For Understanding the Code
- **[COMPONENT_PATTERNS.md](COMPONENT_PATTERNS.md)** - Angular architecture guide
- **[PROJECTS_EXPANSION_SUMMARY.md](PROJECTS_EXPANSION_SUMMARY.md)** - Recent Projects updates
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation
- **[STRATEGIC_PLANNER_ANALYSIS.md](STRATEGIC_PLANNER_ANALYSIS.md)** - APEX app analysis
- **[APEX_APP_INFO.md](APEX_APP_INFO.md)** - APEX app details

### For Migration Planning
- **[.github/agents/apex-to-dotnet-migration-guide.md](.github/agents/apex-to-dotnet-migration-guide.md)** - Comprehensive migration strategy (10-step process)
- **[.github/agents/README.md](.github/agents/README.md)** - Copilot Agents overview

### For Navigation
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - All docs indexed and categorized

---

## 🎯 Key Benefits of This Approach

### Technical Benefits
- ✅ **Modern Stack** - Angular 17 + .NET 10 with latest features
- ✅ **Maintainable** - Clear separation of concerns, testable code
- ✅ **Scalable** - Microservices-ready architecture
- ✅ **Cloud Native** - Designed for OCI/Azure/AWS deployment
- ✅ **Type Safe** - TypeScript + C# catch errors at compile time

### Business Benefits
- ✅ **Lower Risk** - Incremental migration with fallback options
- ✅ **Faster Time-to-Market** - Reuse existing APEX database and logic
- ✅ **Better UX** - Modern, responsive interface
- ✅ **Vendor Flexibility** - Not locked into APEX licensing
- ✅ **Talent Pool** - Easier to hire Angular/.NET developers

### Migration Benefits
- ✅ **No Big Bang** - Migrate workflow-by-workflow
- ✅ **Continuous Delivery** - Deploy incrementally to production
- ✅ **Behavioral Parity** - Proven testing approach ensures identical functionality
- ✅ **Shared Data** - Both systems use same Oracle database during transition

---

## 🛠️ Troubleshooting

### Angular Won't Start

```bash
cd ApexToDotNet.Web
rm -rf node_modules package-lock.json
npm install
ng serve
```

### .NET API Won't Start

```bash
cd ApexToDotNet.API
dotnet clean
dotnet restore
dotnet build
dotnet run
```

### Browser Shows Old Version

- Hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
- Clear cache in DevTools (F12) → Application → Clear Storage
- Try incognito/private window

### Port Already in Use

```bash
# Find process using port
lsof -i :4200  # or :5000

# Kill process
kill -9 <PID>
```

See **[RUNNING_THE_APP.md](RUNNING_THE_APP.md)** for comprehensive troubleshooting.

---

## � Connecting to Your APEX Instance

This POC is designed to connect to **your** Oracle APEX application via ORDS REST endpoints.

### Option 1: Use Mock Data (Default)
- ✅ **No setup required** - works out of the box
- ✅ **Perfect for demos** - see all features immediately
- ❌ **Not connected** - changes don't persist

### Option 2: Connect to Your APEX
1. Create REST endpoints in your APEX app (30-60 min)
2. Configure connection in `.env` file
3. Restart API and Angular servers
4. **Full integration** - real data, live updates!

**See**: [ORDS_ENDPOINTS_GUIDE.md](ORDS_ENDPOINTS_GUIDE.md) for step-by-step instructions.

---

## 📊 Current Status: POC v0.2

**Version**: 0.2-alpha  
**Date**: February 2026  
**Status**: Demo Ready with Mock Data

### What Works Today ✅
- Complete Angular frontend with 5 modules
- Complete .NET API with 3 controllers
- Enhanced Projects module (filters, detail, edit)
- Sessions with FullCalendar
- Activities and People modules
- Responsive design (mobile, tablet, desktop)
- Mock data for all features

### What's Next 🔄
1. Create ORDS endpoints in APEX
2. Connect to live data
3. Add remaining modules (Person Groups, Releases)
4. Implement authentication
5. Add comprehensive testing

---

## 🤝 Questions or Feedback?

This is a **Proof of Concept** to demonstrate the migration approach. For questions about:

- **Getting Started**: See [GETTING_STARTED.md](GETTING_STARTED.md)
- **Configuration**: See [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
- **Architecture**: See [COMPONENT_PATTERNS.md](COMPONENT_PATTERNS.md)
- **Migration Strategy**: See [.github/agents/apex-to-dotnet-migration-guide.md](.github/agents/apex-to-dotnet-migration-guide.md)

---

## 📝 License

This POC is provided as-is for demonstration purposes.

---

## 🎉 Ready to Explore?

**Start here**: [GETTING_STARTED.md](GETTING_STARTED.md) - Get up and running in 5 minutes!

**Try it now**:
```bash
# 1. Start API
cd ApexToDotNet.API && dotnet run

# 2. Start Angular (new terminal)
cd ApexToDotNet.Web && ng serve

# 3. Open browser
open http://localhost:4200
```

**See it in action**: Navigate to Projects → Click "Project 1" → Explore the tabbed interface! 🚀

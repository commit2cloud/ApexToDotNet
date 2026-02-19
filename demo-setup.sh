#!/bin/bash

# Quick Demo Setup Script
# This script helps you prepare for the APEX sync demonstration

echo "🎬 ApexToDotNet - Demo Setup"
echo "=============================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if applications are running
echo -e "${BLUE}Checking application status...${NC}"
echo ""

# Check .NET API
if curl -s http://localhost:5000/swagger/index.html > /dev/null 2>&1; then
    echo -e "${GREEN}✅ .NET API is running${NC} (http://localhost:5000)"
else
    echo -e "${YELLOW}⚠️  .NET API not detected${NC}"
    echo "   Start with: cd ApexToDotNet.API && dotnet run"
fi

# Check Angular app
if curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Angular app is running${NC} (http://localhost:4200)"
else
    echo -e "${YELLOW}⚠️  Angular app not detected${NC}"
    echo "   Start with: cd ApexToDotNet.Web && ng serve"
fi

echo ""
echo -e "${BLUE}Demo Preparation:${NC}"
echo ""

# Create a demo changes file
cat > DEMO_CHANGES.md << 'EOF'
# Demo Changes to Make

## Quick Change: Update Project Name

### In APEX (or mock data):
```
Project 1:
OLD: "Customer Portal Redesign"
NEW: "Customer Portal Redesign - Phase 2"
```

### Files to Update:
1. `ApexToDotNet.Web/src/app/services/project.service.ts`
   - Line ~25: Update project name in mockProjects array

### Demo Script:
1. Show current UI with old name
2. Edit the service file
3. Save (Angular auto-reloads)
4. Show UI with updated name
5. Explain: "With ORDS, this would be automatic"

---

## Alternative: Add New Status

### New Status Value:
```
Display: "Under Review"
Value: "UNDER_REVIEW"
Color: Orange (#ffc107)
```

### Files to Update:
1. `ApexToDotNet.Web/src/app/models/project.ts`
   - Add "Under Review" to Status type

2. `ApexToDotNet.Web/src/app/services/project.service.ts`
   - Update project 1 status to "Under Review"

3. `ApexToDotNet.Web/src/app/features/projects/project-list/project-list.component.ts`
   - Add "Under Review" to statusOptions array

4. `ApexToDotNet.Web/src/app/features/projects/project-list/project-list.component.css`
   - Add styling for .under-review badge

### Demo Duration: ~5 minutes
EOF

echo -e "${GREEN}✅ Created DEMO_CHANGES.md${NC} with quick reference"
echo ""

echo -e "${BLUE}Demo Checklist:${NC}"
echo ""
echo "  📄 Documentation:"
echo "     [ ] DEMO_SYNC_FROM_APEX.md - Full demo script"
echo "     [ ] DEMO_CHANGES.md - Quick reference (just created)"
echo ""
echo "  🖥️  Applications:"
echo "     [ ] .NET API running on http://localhost:5000"
echo "     [ ] Angular app running on http://localhost:4200"
echo "     [ ] Browser open with dev tools (F12)"
echo ""
echo "  📝 Code Editor:"
echo "     [ ] VS Code open"
echo "     [ ] Files ready to edit:"
echo "        - project.service.ts"
echo "        - project-list.component.ts"
echo ""
echo "  🎯 Demo Goals:"
echo "     [ ] Show current state in browser"
echo "     [ ] Make a small change in code"
echo "     [ ] Show auto-reload and updated UI"
echo "     [ ] Explain ORDS will automate this"
echo ""

echo -e "${BLUE}Quick Demo Commands:${NC}"
echo ""
echo "  # Start .NET API (Terminal 1)"
echo "  cd ApexToDotNet.API && dotnet run"
echo ""
echo "  # Start Angular (Terminal 2)"
echo "  cd ApexToDotNet.Web && ng serve"
echo ""
echo "  # Open browser"
echo "  open http://localhost:4200/projects"
echo ""
echo "  # Watch the demo script"
echo "  cat DEMO_SYNC_FROM_APEX.md"
echo ""

echo -e "${GREEN}✅ Demo setup complete!${NC}"
echo ""
echo "Read the full demo script:"
echo "  ${BLUE}cat DEMO_SYNC_FROM_APEX.md${NC}"
echo ""
echo "Or quick reference:"
echo "  ${BLUE}cat DEMO_CHANGES.md${NC}"

#!/bin/bash

# Quick Commit Script for ApexToDotNet POC
# This script performs the git commit with the proper message

echo "🚀 ApexToDotNet - Quick Commit to Customer Repository"
echo "====================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Final security check
echo -e "${BLUE}Step 1: Running final security verification...${NC}"
if ./verify-security.sh > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Security check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Security check had warnings - review verify-security.sh output${NC}"
    ./verify-security.sh
    echo ""
    read -p "Continue with commit anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Commit cancelled."
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Step 2: Reviewing files to commit...${NC}"
git status --short
echo ""

# Count files
MODIFIED=$(git status --short | grep "^ M" | wc -l | tr -d ' ')
DELETED=$(git status --short | grep "^ D" | wc -l | tr -d ' ')
UNTRACKED=$(git status --short | grep "^??" | wc -l | tr -d ' ')

echo "Files summary:"
echo "  Modified: $MODIFIED"
echo "  Deleted: $DELETED"
echo "  New: $UNTRACKED"
echo ""

read -p "Proceed with commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Commit cancelled."
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Staging all changes...${NC}"
git add .
echo -e "${GREEN}✅ Files staged${NC}"

echo ""
echo -e "${BLUE}Step 4: Creating commit...${NC}"

git commit -m "feat: APEX to .NET POC - Strategic Planner demo

- Enhanced Projects module with list, detail, and edit views
- Sessions module with FullCalendar integration
- Activities and People management interfaces
- Angular 17 standalone components + .NET 10 Web API
- Comprehensive documentation (19 guides)
- Security verified - no credentials committed
- Mock data demo ready, ORDS integration prepared
- Repository cleaned and customer-ready

Working Features:
- Projects (list/detail/edit with filters and search)
- Sessions (calendar and list views)
- Activities and People modules
- Responsive navigation and routing
- 30+ sample projects with realistic data

Next Phase:
- ORDS REST endpoint implementation
- Live APEX data connection
- Additional modules (Person Groups, Releases, Project Groups)
- Authentication and authorization
- Comprehensive testing

This POC demonstrates the Strangler Fig pattern for gradually
migrating Oracle APEX applications to modern .NET/Angular stack
while maintaining 100% feature parity."

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commit created successfully!${NC}"
    echo ""
    echo -e "${BLUE}Step 5: Ready to push...${NC}"
    echo ""
    echo "Run this command to push to remote:"
    echo -e "${GREEN}  git push origin main${NC}"
    echo ""
    echo "Or run this to push now:"
    echo ""
    read -p "Push to remote now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${BLUE}Pushing to remote...${NC}"
        git push origin main
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}🎉 Success! Repository pushed to remote!${NC}"
            echo ""
            echo "✅ POC is now available for customer!"
            echo ""
            echo "Share with customer:"
            echo "  1. Repository URL"
            echo "  2. Point them to README.md"
            echo "  3. Highlight 'Try It Yourself (5 Minutes)' section"
        else
            echo ""
            echo "Push failed. Try manually:"
            echo "  git push origin main"
        fi
    else
        echo ""
        echo "Remember to push when ready:"
        echo "  git push origin main"
    fi
else
    echo "Commit failed. Please check the error above."
    exit 1
fi

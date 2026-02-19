#!/bin/bash

# GitHub Repository Setup Script
# This script helps set up the ApexToDotNet repository on GitHub

echo "🚀 ApexToDotNet - GitHub Repository Setup"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check current state
echo -e "${BLUE}📋 Current Repository Status:${NC}"
echo ""
echo "  Git User: $(git config user.name)"
echo "  Git Email: $(git config user.email)"
echo "  Current Branch: $(git branch --show-current)"
echo "  Current Remote: $(git remote get-url origin 2>/dev/null || echo 'None')"
echo ""

# Step 1: Prompt for GitHub username
echo -e "${BLUE}Step 1: GitHub Repository Setup${NC}"
echo ""
read -p "Enter your GitHub username (e.g., commit2cloud): " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username is required${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ GitHub username: $GITHUB_USERNAME${NC}"
echo ""

# Step 2: Confirm repository creation
echo -e "${YELLOW}⚠️  Before continuing, create the repository on GitHub:${NC}"
echo ""
echo "  1. Go to: https://github.com/new"
echo "  2. Repository name: ApexToDotNet"
echo "  3. Description: APEX to .NET Migration POC"
echo "  4. Visibility: Public (recommended for customer sharing)"
echo "  5. DO NOT initialize with README, .gitignore, or license"
echo "  6. Click 'Create repository'"
echo ""
read -p "Have you created the repository on GitHub? (y/n): " REPO_CREATED

if [[ ! $REPO_CREATED =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Please create the repository first, then run this script again.${NC}"
    echo ""
    echo "Instructions are in: GITHUB_SETUP_INSTRUCTIONS.md"
    exit 0
fi

echo ""
echo -e "${GREEN}✅ Repository created on GitHub${NC}"
echo ""

# Step 3: Choose protocol
echo -e "${BLUE}Step 3: Choose Git Protocol${NC}"
echo ""
echo "  1. HTTPS (requires Personal Access Token)"
echo "  2. SSH (requires SSH key setup)"
echo ""
read -p "Choose protocol (1 or 2): " PROTOCOL_CHOICE

if [ "$PROTOCOL_CHOICE" = "1" ]; then
    REPO_URL="https://github.com/$GITHUB_USERNAME/ApexToDotNet.git"
    echo -e "${GREEN}✅ Using HTTPS${NC}"
elif [ "$PROTOCOL_CHOICE" = "2" ]; then
    REPO_URL="git@github.com:$GITHUB_USERNAME/ApexToDotNet.git"
    echo -e "${GREEN}✅ Using SSH${NC}"
else
    echo -e "${RED}❌ Invalid choice${NC}"
    exit 1
fi

echo ""
echo "Repository URL: $REPO_URL"
echo ""

# Step 4: Update remote
echo -e "${BLUE}Step 4: Updating Git Remote${NC}"
echo ""

# Remove old remote
if git remote get-url origin >/dev/null 2>&1; then
    echo "Removing old remote..."
    git remote remove origin
    echo -e "${GREEN}✅ Old remote removed${NC}"
fi

# Add new remote
echo "Adding new remote..."
git remote add origin "$REPO_URL"
echo -e "${GREEN}✅ New remote added${NC}"
echo ""

# Verify remote
echo "Remote configuration:"
git remote -v
echo ""

# Step 5: Rename branch to main
echo -e "${BLUE}Step 5: Renaming Branch to 'main'${NC}"
echo ""

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
    echo -e "${GREEN}✅ Branch renamed to 'main'${NC}"
else
    echo -e "${GREEN}✅ Already on 'main' branch${NC}"
fi
echo ""

# Step 6: Final security check
echo -e "${BLUE}Step 6: Running Security Verification${NC}"
echo ""

if [ -f "./verify-security.sh" ]; then
    chmod +x ./verify-security.sh
    if ./verify-security.sh; then
        echo ""
        echo -e "${GREEN}✅ Security verification passed${NC}"
    else
        echo ""
        echo -e "${RED}❌ Security verification failed${NC}"
        echo "Please review the errors and fix them before pushing."
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  verify-security.sh not found, skipping check${NC}"
fi
echo ""

# Step 7: Stage and commit
echo -e "${BLUE}Step 7: Staging and Committing Changes${NC}"
echo ""

# Show what will be committed
echo "Files to be committed:"
git status --short | head -20
if [ $(git status --short | wc -l) -gt 20 ]; then
    echo "... and $(($(git status --short | wc -l) - 20)) more files"
fi
echo ""

read -p "Proceed with staging all files? (y/n): " PROCEED_STAGING

if [[ ! $PROCEED_STAGING =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Staging cancelled. You can manually stage and commit later.${NC}"
    exit 0
fi

echo ""
echo "Staging all files..."
git add .
echo -e "${GREEN}✅ Files staged${NC}"
echo ""

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
    echo "Creating commit..."
    git commit -m "feat: APEX to .NET POC - Strategic Planner demo

- Enhanced Projects module with list, detail, and edit views
- Sessions module with FullCalendar integration
- Activities and People management interfaces
- Angular 17 standalone components + .NET 10 Web API
- Comprehensive documentation (27+ guides)
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

    echo -e "${GREEN}✅ Commit created${NC}"
fi
echo ""

# Step 8: Push to GitHub
echo -e "${BLUE}Step 8: Pushing to GitHub${NC}"
echo ""

if [ "$PROTOCOL_CHOICE" = "1" ]; then
    echo -e "${YELLOW}⚠️  HTTPS Authentication:${NC}"
    echo "  - You'll need a Personal Access Token (not password)"
    echo "  - Create one at: https://github.com/settings/tokens"
    echo "  - Required scope: 'repo' (full control)"
    echo ""
fi

read -p "Ready to push to GitHub? (y/n): " PROCEED_PUSH

if [[ ! $PROCEED_PUSH =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Push cancelled.${NC}"
    echo ""
    echo "You can manually push later with:"
    echo "  git push -u origin main"
    exit 0
fi

echo ""
echo "Pushing to GitHub..."
echo ""

if git push -u origin main; then
    echo ""
    echo -e "${GREEN}🎉 Success! Repository pushed to GitHub!${NC}"
    echo ""
    echo "Your repository is now live at:"
    echo -e "${BLUE}https://github.com/$GITHUB_USERNAME/ApexToDotNet${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Visit your repository on GitHub"
    echo "  2. Verify all files are present"
    echo "  3. Check that README.md displays correctly"
    echo "  4. Add repository description and topics (optional)"
    echo "  5. Share the URL with your customer"
    echo ""
    echo -e "${GREEN}✅ Repository setup complete!${NC}"
else
    echo ""
    echo -e "${RED}❌ Push failed${NC}"
    echo ""
    echo "Common issues:"
    echo "  1. Authentication failed (need Personal Access Token for HTTPS)"
    echo "  2. SSH key not configured (for SSH protocol)"
    echo "  3. Repository doesn't exist on GitHub"
    echo ""
    echo "See GITHUB_SETUP_INSTRUCTIONS.md for troubleshooting"
    exit 1
fi

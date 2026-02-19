#!/bin/bash

# Final Cleanup Script Before Customer Commit
# This script performs final cleanup and verification

echo "🧹 ApexToDotNet - Final Cleanup Before Commit"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0
CLEANED=0

echo -e "${BLUE}Step 1: Removing unnecessary cleanup documentation...${NC}"

# Remove temporary cleanup docs that customers don't need
FILES_TO_REMOVE=(
    "CLEANUP_COMPLETE.md"
    "CLEANUP_SUMMARY.md"
    "READY_FOR_CUSTOMER.md"
    "SECURITY_VERIFICATION_COMPLETE.md"
)

for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  ✅ Removed: $file"
        CLEANED=$((CLEANED+1))
    fi
done

echo ""
echo -e "${BLUE}Step 2: Verifying .gitignore is comprehensive...${NC}"

if [ -f ".gitignore" ]; then
    # Check for key patterns
    PATTERNS=(".env" "bin/" "obj/" "node_modules/" "appsettings.Development.json")
    MISSING=0
    
    for pattern in "${PATTERNS[@]}"; do
        if grep -q "$pattern" .gitignore; then
            echo "  ✅ Found: $pattern"
        else
            echo -e "  ${RED}❌ Missing: $pattern${NC}"
            MISSING=$((MISSING+1))
            ERRORS=$((ERRORS+1))
        fi
    done
    
    if [ $MISSING -eq 0 ]; then
        echo -e "${GREEN}  ✅ .gitignore looks complete${NC}"
    fi
else
    echo -e "${RED}❌ .gitignore not found!${NC}"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo -e "${BLUE}Step 3: Checking for sensitive data in tracked files...${NC}"

# Check if any sensitive files are tracked
SENSITIVE_PATTERNS=(".env$" "appsettings.Development.json" ".pem$" ".key$" "wallet/")

FOUND_SENSITIVE=0
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if git ls-files | grep -E "$pattern" >/dev/null 2>&1; then
        echo -e "  ${RED}❌ FAIL: Sensitive file tracked matching: $pattern${NC}"
        ERRORS=$((ERRORS+1))
        FOUND_SENSITIVE=1
    fi
done

if [ $FOUND_SENSITIVE -eq 0 ]; then
    echo -e "  ${GREEN}✅ No sensitive files tracked${NC}"
fi

echo ""
echo -e "${BLUE}Step 4: Verifying documentation files exist...${NC}"

REQUIRED_DOCS=(
    "README.md"
    "GETTING_STARTED.md"
    "RUNNING_THE_APP.md"
    "CONFIGURATION_GUIDE.md"
    "ORDS_ENDPOINTS_GUIDE.md"
    "PRE_COMMIT_CHECKLIST.md"
    ".env.example"
    ".env.oci.template"
)

for doc in "${REQUIRED_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ Found: $doc"
    else
        echo -e "  ${YELLOW}⚠️  Missing: $doc${NC}"
        WARNINGS=$((WARNINGS+1))
    fi
done

echo ""
echo -e "${BLUE}Step 5: Checking README.md quality...${NC}"

if [ -f "README.md" ]; then
    # Check if README has key sections
    SECTIONS=("Try It Yourself" "What's Working" "TODO" "Architecture" "Documentation")
    
    for section in "${SECTIONS[@]}"; do
        if grep -q "$section" README.md; then
            echo "  ✅ Has section: $section"
        else
            echo -e "  ${YELLOW}⚠️  Missing section: $section${NC}"
            WARNINGS=$((WARNINGS+1))
        fi
    done
    
    # Check README size
    README_SIZE=$(wc -l < README.md)
    if [ $README_SIZE -lt 100 ]; then
        echo -e "  ${YELLOW}⚠️  README seems short ($README_SIZE lines)${NC}"
        WARNINGS=$((WARNINGS+1))
    else
        echo -e "  ${GREEN}✅ README is comprehensive ($README_SIZE lines)${NC}"
    fi
else
    echo -e "  ${RED}❌ README.md not found!${NC}"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo -e "${BLUE}Step 6: Verifying build artifacts are not tracked...${NC}"

BUILD_DIRS=("bin/" "obj/" "node_modules/" "dist/" ".angular/")

for dir in "${BUILD_DIRS[@]}"; do
    if git ls-files | grep -q "^$dir"; then
        echo -e "  ${RED}❌ Build artifacts tracked: $dir${NC}"
        ERRORS=$((ERRORS+1))
    else
        echo "  ✅ Not tracked: $dir"
    fi
done

echo ""
echo -e "${BLUE}Step 7: Checking appsettings.json for placeholders...${NC}"

if [ -f "ApexToDotNet.API/appsettings.json" ]; then
    if git ls-files --error-unmatch ApexToDotNet.API/appsettings.json >/dev/null 2>&1; then
        # File will be tracked - check it has placeholders
        if grep -q "YOUR_PASSWORD_HERE" ApexToDotNet.API/appsettings.json; then
            echo "  ✅ Has placeholder password"
        else
            echo -e "  ${RED}❌ appsettings.json may have real password!${NC}"
            ERRORS=$((ERRORS+1))
        fi
        
        if grep -q "your-instance" ApexToDotNet.API/appsettings.json; then
            echo "  ✅ Has placeholder hostname"
        else
            echo -e "  ${YELLOW}⚠️  appsettings.json may have real hostname${NC}"
            WARNINGS=$((WARNINGS+1))
        fi
    else
        echo "  ℹ️  appsettings.json not tracked (optional)"
    fi
fi

echo ""
echo -e "${BLUE}Step 8: Checking for TODO markers in code...${NC}"

TODO_COUNT=$(git grep -i "TODO\|FIXME\|HACK" -- "*.cs" "*.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$TODO_COUNT" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️  Found $TODO_COUNT TODO/FIXME comments${NC}"
    echo "  ℹ️  Consider addressing these before customer demo"
    WARNINGS=$((WARNINGS+1))
else
    echo "  ✅ No TODO markers found"
fi

echo ""
echo -e "${BLUE}Step 9: Running security verification...${NC}"

if [ -f "verify-security.sh" ]; then
    if ./verify-security.sh > /dev/null 2>&1; then
        echo "  ✅ Security verification passed"
    else
        echo -e "  ${RED}❌ Security verification failed${NC}"
        echo "  Run ./verify-security.sh for details"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "  ${YELLOW}⚠️  verify-security.sh not found${NC}"
    WARNINGS=$((WARNINGS+1))
fi

# Final Summary
echo ""
echo "=============================================="
echo "📊 Cleanup Summary"
echo "=============================================="
echo ""
echo "  Files Cleaned: $CLEANED"
echo "  Errors Found: $ERRORS"
echo "  Warnings: $WARNINGS"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ FAILED: Fix $ERRORS error(s) before committing${NC}"
    echo ""
    echo "🚨 DO NOT COMMIT until all errors are resolved!"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found - review recommended${NC}"
    echo ""
    echo "Continue with commit? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${GREEN}✅ Repository ready for customer!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Review changes: git status"
        echo "  2. Stage files: git add ."
        echo "  3. Commit: git commit -m 'feat: APEX to .NET POC'"
        echo "  4. Push: git push origin main"
        exit 0
    else
        echo "Cleanup completed but commit cancelled."
        exit 1
    fi
else
    echo -e "${GREEN}✅ Perfect! Repository is ready for customer!${NC}"
    echo ""
    echo "🎉 All checks passed!"
    echo ""
    echo "Next steps:"
    echo "  1. Review changes: git status"
    echo "  2. Stage files: git add ."
    echo "  3. Commit: git commit -m 'feat: APEX to .NET POC - Strategic Planner demo'"
    echo "  4. Push: git push origin main"
    echo ""
    echo "Repository is clean, secure, and ready to share! 🚀"
    exit 0
fi

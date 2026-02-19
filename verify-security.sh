#!/bin/bash

# Pre-Commit Security Verification Script
# Run this before committing to customer repositories

echo "🔍 ApexToDotNet - Pre-Commit Security Check"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Verify .env is not tracked
echo "1️⃣  Checking .env file..."
if git ls-files | grep -q "^\.env$"; then
    echo -e "${RED}❌ FAIL: .env file is tracked in git!${NC}"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✅ PASS: .env is not tracked${NC}"
fi

# Check 2: Verify appsettings.Development.json is not tracked
echo ""
echo "2️⃣  Checking appsettings.Development.json..."
if git ls-files | grep -q "appsettings.Development.json"; then
    echo -e "${RED}❌ FAIL: appsettings.Development.json is tracked!${NC}"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✅ PASS: appsettings.Development.json is not tracked${NC}"
fi

# Check 3: Verify bin/ and obj/ are not tracked
echo ""
echo "3️⃣  Checking build artifacts..."
if git ls-files | grep -q -E "(bin/|obj/)"; then
    echo -e "${RED}❌ FAIL: Build artifacts (bin/ or obj/) are tracked!${NC}"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✅ PASS: Build artifacts not tracked${NC}"
fi

# Check 4: Verify node_modules is not tracked
echo ""
echo "4️⃣  Checking node_modules..."
if git ls-files | grep -q "node_modules/"; then
    echo -e "${RED}❌ FAIL: node_modules is tracked!${NC}"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✅ PASS: node_modules not tracked${NC}"
fi

# Check 5: Search for potential passwords in tracked files
echo ""
echo "5️⃣  Scanning for hardcoded passwords..."
PASSWORD_MATCHES=$(git grep -i "password.*=" -- "*.cs" "*.ts" "*.json" | grep -v "YOUR_PASSWORD_HERE" | grep -v "password_here" | grep -v "your_password" | grep -v "Password:" | grep -v "// Password" | grep -v "PasswordHash" | wc -l | tr -d ' ')
if [ "$PASSWORD_MATCHES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING: Found $PASSWORD_MATCHES potential password references${NC}"
    echo "   Review these carefully:"
    git grep -i "password.*=" -- "*.cs" "*.ts" "*.json" | grep -v "YOUR_PASSWORD_HERE" | grep -v "password_here" | grep -v "your_password" | head -5
    WARNINGS=$((WARNINGS+1))
else
    echo -e "${GREEN}✅ PASS: No hardcoded passwords found${NC}"
fi

# Check 6: Verify appsettings.json only has placeholders
echo ""
echo "6️⃣  Checking appsettings.json for real credentials..."
if [ -f "ApexToDotNet.API/appsettings.json" ]; then
    # Only check if file is tracked
    if git ls-files --error-unmatch ApexToDotNet.API/appsettings.json >/dev/null 2>&1; then
        if grep -q "g5f6a9f954550cc" ApexToDotNet.API/appsettings.json 2>/dev/null; then
            echo -e "${RED}❌ FAIL: appsettings.json contains real OCI hostname!${NC}"
            ERRORS=$((ERRORS+1))
        elif grep -v "YOUR_PASSWORD_HERE" ApexToDotNet.API/appsettings.json | grep -q "Password=.*[^H][^E][^R][^E]"; then
            echo -e "${YELLOW}⚠️  WARNING: appsettings.json may contain real password${NC}"
            WARNINGS=$((WARNINGS+1))
        else
            echo -e "${GREEN}✅ PASS: appsettings.json has placeholders${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  SKIPPED: appsettings.json not tracked in git${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  WARNING: appsettings.json not found${NC}"
fi

# Check 7: Verify .gitignore exists and is comprehensive
echo ""
echo "7️⃣  Checking .gitignore..."
if [ ! -f ".gitignore" ]; then
    echo -e "${RED}❌ FAIL: .gitignore not found!${NC}"
    ERRORS=$((ERRORS+1))
elif [ $(wc -l < .gitignore) -lt 20 ]; then
    echo -e "${YELLOW}⚠️  WARNING: .gitignore seems incomplete (< 20 lines)${NC}"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "${GREEN}✅ PASS: .gitignore exists and looks comprehensive${NC}"
fi

# Check 8: Look for wallet files
echo ""
echo "8️⃣  Checking for wallet files..."
if git ls-files | grep -q -E "\.(wallet|pem|key)$"; then
    echo -e "${RED}❌ FAIL: Wallet or key files are tracked!${NC}"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✅ PASS: No wallet files tracked${NC}"
fi

# Summary
echo ""
echo "==========================================="
echo "📊 Summary"
echo "==========================================="
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ FAILED: $ERRORS critical issue(s) found${NC}"
    echo ""
    echo "🚨 DO NOT COMMIT until issues are resolved!"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNINGS: $WARNINGS potential issue(s) found${NC}"
    echo ""
    echo "Review warnings before committing."
    echo "Continue? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✅ All checks passed!${NC}"
        echo ""
        echo "Safe to commit. Suggested next steps:"
        echo "  git add ."
        echo "  git commit -m 'feat: Initial POC for customer demo'"
        exit 0
    else
        echo "Commit cancelled."
        exit 1
    fi
else
    echo -e "${GREEN}✅ All checks passed! No issues found.${NC}"
    echo ""
    echo "🎉 Repository is secure and ready to commit!"
    echo ""
    echo "Suggested next steps:"
    echo "  git add ."
    echo "  git commit -m 'feat: Initial POC for customer demo'"
    echo "  git push origin main"
    exit 0
fi

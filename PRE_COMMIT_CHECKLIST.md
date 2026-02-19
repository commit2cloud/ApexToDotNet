# Pre-Commit Security Checklist

**BEFORE** sharing this POC with customers, verify these items:

---

## ✅ Files to Check

### 1. Environment Files
- [ ] `.env` is NOT in git (should be gitignored)
- [ ] `.env.example` only has placeholder values
- [ ] `.env.oci.template` only has placeholder values

### 2. Configuration Files
- [ ] `appsettings.Development.json` is NOT in git (gitignored)
- [ ] `appsettings.json` has NO real passwords (only "YOUR_PASSWORD_HERE")
- [ ] `appsettings.json` has NO real connection strings (only placeholders)

### 3. Source Code
- [ ] No hardcoded passwords in `.cs` files
- [ ] No hardcoded API keys in `.ts` files
- [ ] No sensitive data in comments

### 4. Build Artifacts
- [ ] `bin/` folder is gitignored
- [ ] `obj/` folder is gitignored
- [ ] `node_modules/` is gitignored
- [ ] `.angular/` cache is gitignored

### 5. Documentation
- [ ] No customer-specific details in README
- [ ] No internal URLs in public docs
- [ ] Screenshots don't show sensitive data

---

## 🔍 Quick Verification Commands

```bash
# Check what will be committed
git status

# Check for potential secrets in tracked files
git grep -i "password" -- "*.json" "*.cs" "*.ts"
git grep -i "secret" -- "*.json" "*.cs" "*.ts"
git grep -i "key" -- "*.json" "*.cs" "*.ts"

# Verify .env is not tracked
git ls-files | grep ".env"

# Should return nothing (or only .env.example/.env.oci.template)

# Verify bin/obj are not tracked
git ls-files | grep -E "(bin/|obj/)"

# Should return nothing
```

---

## 🚨 Found Secrets? Here's How to Fix

### If you find secrets in files about to be committed:

1. **DO NOT COMMIT**
2. Replace secrets with placeholders
3. Add file to `.gitignore` if needed
4. Use environment variables instead

### If you already committed secrets:

1. **Rotate credentials immediately**
2. Use `git filter-branch` or BFG Repo-Cleaner to remove from history
3. Force push to remote (if applicable)

---

## ✅ Safe to Commit

Once all checks pass:

```bash
# Add files
git add .

# Verify what's staged
git status
git diff --cached

# Commit
git commit -m "feat: Initial POC for customer demo"

# Push (if applicable)
git push origin main
```

---

## 📋 Files That SHOULD Be Committed

### Documentation
- ✅ README.md
- ✅ GETTING_STARTED.md
- ✅ All other `.md` files
- ✅ .env.example (with placeholders)
- ✅ .env.oci.template (with placeholders)

### Source Code
- ✅ All `.cs` files (without secrets)
- ✅ All `.ts` files (without secrets)
- ✅ All `.html` files
- ✅ All `.css` files
- ✅ .csproj files
- ✅ package.json, tsconfig.json, angular.json

### Configuration Templates
- ✅ appsettings.json (with placeholders)

### Archives
- ✅ docs/archive/ (if keeping historical docs)

---

## 📋 Files That Should NOT Be Committed

### Secrets & Credentials
- ❌ .env (actual values)
- ❌ appsettings.Development.json
- ❌ Any wallet files
- ❌ .oci/ folder
- ❌ *.pem, *.key files

### Build Artifacts
- ❌ bin/
- ❌ obj/
- ❌ node_modules/
- ❌ dist/
- ❌ .angular/

### IDE Files
- ❌ .vscode/
- ❌ .idea/
- ❌ *.suo, *.user

### Temporary Files
- ❌ *.log
- ❌ *.tmp
- ❌ .DS_Store

---

## 🎯 Customer POC Specific Notes

When sharing with customers:

1. **Replace all instance-specific URLs** with placeholders
2. **Provide CONFIGURATION_GUIDE.md** for setup instructions
3. **Include .env.example** so they know what to configure
4. **Remove any internal references** (internal Slack, Jira, etc.)
5. **Consider adding LICENSE** file if applicable

---

**Status**: Run through this checklist before every commit to customer-facing repositories! 🔒

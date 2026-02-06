# Your APEX Workspace Setup - "apexdotnet"

**Workspace Name**: apexdotnet  
**Created**: February 6, 2026  
**Environment**: Oracle APEX Cloud (apex.oracle.com)

---

## ✅ What You Have

- ✅ **Workspace**: apexdotnet (created and active)
- ✅ **Access**: apex.oracle.com login credentials
- ✅ **Repository**: github/ApexToDotNet cloned locally
- ✅ **Documentation**: Complete migration guides available

---

## 🎯 What You Need Next

### 1. Install Sample Application (Do This Now!)

**Step-by-step:**

1. **Log into your workspace**
   - Go to: https://apex.oracle.com
   - Sign in with your credentials
   - Select workspace: **apexdotnet**

2. **Install Sample Database Application**
   - Click **"App Builder"** (top menu)
   - Click **"Install Sample App"** button (or "Create" → "From a Sample App")
   - Find and select: **"Sample Database Application"**
   - Click **"Install Application"**
   - Wait for installation to complete (30-60 seconds)

3. **Run the Application**
   - After installation, click **"Run Application"**
   - You'll need to set an admin password if prompted
   - Explore the app to see workflows

**What this gives you:**
- Complete CRUD application to study
- Real workflows to practice documenting
- Tables and data to explore
- PL/SQL code examples

---

### 2. Access Your SQL Workshop

**Navigation:**
1. From your apexdotnet workspace home
2. Click **"SQL Workshop"** (top menu)
3. Try these tools:
   - **Object Browser**: See tables, views, procedures
   - **SQL Commands**: Run queries
   - **RESTful Services**: View/create REST APIs

**What to explore:**
```sql
-- See what tables exist
SELECT table_name 
FROM user_tables 
ORDER BY table_name;

-- View sample data
SELECT * FROM [table_name] WHERE ROWNUM <= 5;
```

---

### 3. Create Your First Workflow Inventory

**File to create**: `workflow-inventory-sample.md` (in your local repository)

**Pick one of these simple workflows from the sample app:**
- Creating a new record (e.g., Customer, Project, Task)
- Viewing a list and details
- Updating an existing record
- Simple search/filter

**Use this template:**

```markdown
# Workflow Inventory: [Workflow Name]

**Workspace**: apexdotnet  
**Application**: Sample Database Application  
**Date**: February 6, 2026

## 1. Overview
- **Workflow Name**: Create New Customer
- **Purpose**: Allow users to add new customers to the system
- **User Role**: Any authenticated user
- **Entry Point**: Menu → Customers → Create

## 2. Pages Involved
- Page 1: Dashboard (starting point)
- Page 2: Customer List (navigation)
- Page 3: Create/Edit Customer Form (main page)

## 3. Data Model

### Tables
| Table Name | Purpose | Operations |
|------------|---------|-----------|
| CUSTOMERS  | Store customer data | INSERT, SELECT |
| ADDRESSES  | Store addresses | INSERT |

### Key Fields
- **CUSTOMER_ID**: Primary key (NUMBER, auto-generated)
- **CUSTOMER_NAME**: Required (VARCHAR2(100))
- **EMAIL**: Required, unique (VARCHAR2(255))
- **PHONE**: Optional (VARCHAR2(20))
- **STATUS**: Default 'ACTIVE' (VARCHAR2(20))
- **CREATED_DATE**: Auto-set (TIMESTAMP)
- **CREATED_BY**: Current user (VARCHAR2(100))

## 4. Business Logic

### Validations
1. Customer name required
2. Email required and must be valid format
3. Email must be unique across all customers
4. Phone format: (XXX) XXX-XXXX or blank
5. Status must be 'ACTIVE' or 'INACTIVE'

### PL/SQL Code Locations
```sql
-- Check for this in Page Designer:
-- 1. Page Processing → Validations
-- 2. Page Processing → Processes
-- 3. Shared Components → Application Processes

-- Example validation:
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM customers
  WHERE UPPER(email) = UPPER(:P3_EMAIL)
    AND customer_id != NVL(:P3_CUSTOMER_ID, -1);
  
  IF v_count > 0 THEN
    RETURN 'Email already exists';
  END IF;
END;
```

### Computations
- CUSTOMER_ID: Generated from sequence SEQ_CUSTOMERS
- CREATED_DATE: SYSDATE
- CREATED_BY: :APP_USER
- MODIFIED_DATE: SYSDATE (on update)

## 5. Security & Authorization

### Authorization Scheme
- Must be authenticated user
- No special role required for this workflow
- Cannot edit customers from other regions (if applicable)

### Page Authorization
- Authorization Scheme: "Must be authenticated"
- Additional conditions: None

## 6. User Interface

### Form Fields
1. **Customer Name**: Text input, required, max 100 chars
2. **Email**: Email input, required, validation
3. **Phone**: Text input, optional, format mask
4. **Status**: Select list (ACTIVE/INACTIVE), default ACTIVE
5. **Notes**: Textarea, optional

### Buttons & Actions
- **Save**: Submit page, run validations, insert record
  - Success: Show message "Customer created successfully"
  - Redirect: Back to customer list (Page 2)
- **Cancel**: Redirect to customer list, no changes
- **Save & Add Another**: Save, clear form, stay on page

### Success/Error Messages
- Success: "Customer created successfully"
- Duplicate email: "This email address is already registered"
- Invalid email: "Please enter a valid email address"
- Missing required: "Customer name is required"

## 7. Integration Points

### Internal
- Navigation to/from customer list
- Refresh customer list after save

### External
- Email notification: Send welcome email (if enabled)
- No external API calls
- No scheduled jobs triggered

## 8. Testing Scenarios

### Happy Path
1. User clicks "Create Customer"
2. Fills in all required fields correctly
3. Clicks "Save"
4. Customer created in database
5. Success message shown
6. Redirected to customer list

### Error Cases
1. Leave name blank → Error message
2. Enter invalid email → Validation error
3. Enter duplicate email → "Email exists" error
4. Enter invalid phone format → Format error

## 9. .NET API Design

### Endpoint
```http
POST /api/customers
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "status": "ACTIVE",
  "notes": "VIP customer"
}

Response (201 Created):
{
  "customerId": 12345,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "status": "ACTIVE",
  "notes": "VIP customer",
  "createdDate": "2026-02-06T15:30:00Z",
  "createdBy": "user@example.com"
}

Errors:
400 - Validation failed
409 - Email already exists
500 - Server error
```

### Service Layer (C#)
```csharp
public class CustomerService
{
    private readonly ICustomerRepository _repository;
    private readonly IEmailService _emailService;
    
    public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerRequest request)
    {
        // Validate email uniqueness
        if (await _repository.EmailExistsAsync(request.Email))
            throw new ConflictException("Email already exists");
        
        // Create entity
        var customer = new Customer
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Status = request.Status ?? "ACTIVE",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = _currentUser.Email
        };
        
        // Save to database
        await _repository.CreateAsync(customer);
        
        // Send welcome email (optional)
        if (_config.SendWelcomeEmails)
            await _emailService.SendWelcomeAsync(customer.Email);
        
        return MapToDto(customer);
    }
}
```

## 10. Migration Notes

### Complexity Assessment
- **Complexity**: Low (simple CRUD)
- **Estimated Effort**: 2-3 days
- **Dependencies**: None
- **Risk Level**: Low

### Migration Priority
- **Priority**: Medium (good learning workflow)
- **Reason**: Simple, well-contained, good first migration

### Key Considerations
- Email validation logic is in PL/SQL - move to C# service
- Sequence-based ID generation - use database sequence or identity
- APEX session state - replace with JWT claims
- Success messages - match exact text for consistency

### Testing Requirements
- [ ] All validations work identically
- [ ] Error messages match APEX version
- [ ] Email uniqueness enforced
- [ ] Success flow matches APEX
- [ ] Performance is equal or better

---

## Notes & Observations

[Add your observations here as you explore]

- 
- 
- 

---

**Created by**: [Your Name]  
**Date**: February 6, 2026  
**Workspace**: apexdotnet
```

---

### 4. Explore the Sample App Structure

**In Page Designer (edit any page):**
1. Click on a page to edit
2. Look at left sidebar sections:
   - **Rendering**: UI components (regions, items, buttons)
   - **Processing**: Logic (validations, processes, branches)
   - **Shared Components**: Reusable elements

**In SQL Workshop:**
1. **Object Browser**: Browse database objects
2. **SQL Scripts**: View/run SQL scripts
3. **Utilities**: Import/export, data loading

---

### 5. Document Your Findings

Create these files in your local repository:

```
ApexToDotNet/
├── workflows/
│   ├── workflow-inventory-create-customer.md
│   ├── workflow-inventory-view-list.md
│   └── workflow-inventory-update-record.md
├── api-designs/
│   ├── customers-api-design.md
│   └── projects-api-design.md
└── notes/
    ├── business-logic-findings.md
    └── database-schema-notes.md
```

---

## 📋 Your Checklist for Today

- [ ] **Log into apexdotnet workspace**
- [ ] **Install Sample Database Application**
- [ ] **Run and explore the sample app**
- [ ] **Navigate through at least 3 different workflows**
- [ ] **Open SQL Workshop → Object Browser**
- [ ] **View 2-3 tables and their structures**
- [ ] **Pick ONE simple workflow to document**
- [ ] **Create workflow inventory using template above**
- [ ] **Sketch the .NET API design for that workflow**

---

## 🎯 Today's Goal

**Complete ONE detailed workflow inventory document**

Success criteria:
- Documented all pages in the workflow
- Listed all tables and fields used
- Captured all business logic and validations
- Sketched equivalent .NET API design
- Noted any questions or concerns

---

## 💡 Tips for apexdotnet Workspace

### Finding Business Logic
1. **Page Level**: Edit page → Processing → Processes/Validations
2. **Application Level**: Shared Components → Application Processes
3. **Database Level**: SQL Workshop → Object Browser → Packages/Procedures

### Understanding Data Flow
1. Start from the UI (form/report)
2. Trace to page processes
3. Follow to database operations
4. Note any PL/SQL in between

### Taking Notes
Keep a running notes file with:
- Interesting patterns you discover
- Questions about business logic
- Ideas for .NET implementation
- Challenges you anticipate

---

## 🆘 Common Questions

**Q: Can't find the sample apps?**
A: Make sure you're logged into the "apexdotnet" workspace. Sample apps are in App Builder → Install Sample App.

**Q: How do I edit a page?**
A: App Builder → Click your app → Click page number → Opens Page Designer.

**Q: Where do I run SQL queries?**
A: SQL Workshop → SQL Commands → Enter your query → Run.

**Q: How detailed should my workflow inventory be?**
A: Very detailed! It's your blueprint. Include every field, validation, error message, and piece of logic.

**Q: What if I don't understand PL/SQL?**
A: That's okay! Just copy the code and note what it does (validation, calculation, etc.). We'll translate it to C# later.

---

## ⏭️ After Today

Once you complete your first workflow inventory:

1. **Review it** - Is everything documented?
2. **Share it** - Get feedback from someone
3. **Use as template** - Document 2-3 more workflows
4. **Read migration guide** - Study sections 1, 2, 4, 6, 7
5. **Plan .NET setup** - Prepare for development environment

---

## 📞 Need Help?

Reference files in `/Users/commit2cloud/ApexToDotNet/`:
- `NEXT_STEPS.md` - Detailed instructions
- `QUICK_REFERENCE.md` - Quick patterns lookup
- `.github/agents/apex-to-dotnet-migration-guide.md` - Full guide

---

**Your workspace**: apexdotnet  
**Your URL**: https://apex.oracle.com  
**Ready to begin!** 🚀

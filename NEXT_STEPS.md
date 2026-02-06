# Your Next Steps - APEX to .NET Migration

## 🎯 Step 1: Install Sample Applications (15 minutes)

Sample apps will help you understand APEX patterns before migrating real applications.

### How to Install:

1. **Log into your APEX workspace** at apex.oracle.com
2. Click **App Builder** (big blue icon)
3. Click **Install Sample App** or **Create** → **From a Sample App**
4. Install these recommended apps:
   - **Sample Database Application** - Best for learning (CRUD operations, reports, forms)
   - **Sample Charts** - Visualization patterns
   - **Sample Reporting** - Report generation patterns

5. After installing, click **Run Application** to explore it

### What to Look For:

- How pages connect to form workflows
- Where business logic lives (PL/SQL, validations, computations)
- How data is displayed (Interactive Reports, Forms, Cards)
- Navigation patterns and user flows
- Security and authorization

---

## 🎯 Step 2: Create Your First Workflow Inventory (30-60 minutes)

Pick ONE simple workflow from the sample app and document it completely.

### Example Workflow: "Create New Customer"

Create a file: `workflow-inventory-create-customer.md`

### Template to Fill Out:

```markdown
# Workflow Inventory: [Workflow Name]

## Overview
- **Workflow Name**: 
- **Purpose**: 
- **User Role**: 
- **Frequency**: (daily/weekly/monthly)
- **Priority**: (high/medium/low)

## Entry Points
- **Menu Location**: 
- **Direct URL**: 
- **Navigation Path**: 
- **Authorization Required**: 

## Pages Involved
1. Page X: [Name] - [Purpose]
2. Page Y: [Name] - [Purpose]
3. Page Z: [Name] - [Purpose]

## Data Entities

### Tables Used
| Table Name | Operations | Purpose |
|------------|-----------|---------|
| CUSTOMERS  | INSERT, SELECT | Store customer data |
| ADDRESSES  | INSERT | Store address info |

### Columns/Fields
- Customer Name (required, varchar2(100))
- Email (required, unique, email format)
- Phone (optional, format validation)
- Status (default: 'Active')

## Business Logic

### Validations
1. Email must be unique
2. Email format must be valid
3. Phone format: (XXX) XXX-XXXX
4. Status defaults to 'Active'

### Computations
1. Customer_ID auto-generated from sequence
2. Created_Date = SYSDATE
3. Modified_Date = SYSDATE

### PL/SQL Procedures
```sql
-- List any stored procedures called
PROCEDURE validate_customer_email(p_email VARCHAR2)
PROCEDURE create_customer(p_name VARCHAR2, p_email VARCHAR2, ...)
```

## Security & Authorization
- **Authorization Scheme**: Must be authenticated user
- **Role Required**: Customer Manager or Admin
- **Data Security**: Users can only see their region's customers

## User Interface Elements

### Form Fields
1. Customer Name - Text Input (required)
2. Email - Email Input (required, unique validation)
3. Phone - Text Input (optional, format mask)
4. Status - Select List (Active/Inactive)

### Buttons
- Save - Submits form, runs validations
- Cancel - Returns to list page
- Save & Add Another - Saves and clears form

### Reports
- Customer List (Interactive Report)
  - Columns: Name, Email, Phone, Status, Created Date
  - Actions: Edit, Delete, View Details
  - Filters: Status, Created Date Range

## Integrations
- **Email**: Send welcome email after creation
- **External API**: Validate address via postal service API
- **Background Jobs**: None

## Error Handling
- Duplicate email: "Email already exists"
- Invalid format: "Please enter valid email"
- Database error: "Unable to save customer"

## Success Criteria
- Customer created in database
- Welcome email sent
- User redirected to customer list
- Success message displayed

## Migration Notes
- **Complexity**: Low (simple CRUD)
- **Estimated Effort**: 2-3 days
- **Dependencies**: None
- **Risks**: Email validation logic embedded in PL/SQL
```

---

## 🎯 Step 3: Explore SQL Workshop (20 minutes)

Understand the database structure and where business logic lives.

### Activities:

1. **Go to SQL Workshop** → **Object Browser**
   - Browse tables used by your sample app
   - Look at table structures, columns, constraints
   - Note foreign key relationships

2. **Go to SQL Workshop** → **SQL Commands**
   - Run queries to see sample data:
   ```sql
   SELECT * FROM [table_name] WHERE ROWNUM <= 10;
   ```
   - Understand data patterns and relationships

3. **Check for PL/SQL**:
   - Go to **Object Browser** → **Packages** or **Procedures**
   - Open any package to see business logic
   - Note which ones are called by your workflow

---

## 🎯 Step 4: Map the .NET API Design (30 minutes)

Based on your workflow inventory, sketch what the .NET API should look like.

### Create: `api-design-create-customer.md`

```markdown
# API Design: Create Customer

## Endpoint

### Create Customer
```http
POST /api/customers
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "status": "Active"
}

Response (201 Created):
{
  "customerId": 12345,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "status": "Active",
  "createdDate": "2026-02-06T10:30:00Z"
}

Errors:
400 - Validation failed (duplicate email, invalid format)
401 - Unauthorized
403 - Forbidden (insufficient permissions)
500 - Server error
```

## Service Layer (C#)

```csharp
public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _repository;
    private readonly IEmailService _emailService;
    
    public async Task<Customer> CreateCustomerAsync(CreateCustomerRequest request)
    {
        // 1. Validate email uniqueness
        if (await _repository.EmailExistsAsync(request.Email))
            throw new ValidationException("Email already exists");
        
        // 2. Validate email format
        if (!IsValidEmail(request.Email))
            throw new ValidationException("Invalid email format");
        
        // 3. Create customer entity
        var customer = new Customer
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Status = request.Status ?? "Active",
            CreatedDate = DateTime.UtcNow,
            ModifiedDate = DateTime.UtcNow
        };
        
        // 4. Save to database
        await _repository.CreateAsync(customer);
        
        // 5. Send welcome email
        await _emailService.SendWelcomeEmailAsync(customer.Email);
        
        return customer;
    }
}
```

## Angular Component

```typescript
// create-customer.component.ts
export class CreateCustomerComponent {
  customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
    status: ['Active']
  });
  
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {}
  
  onSubmit(): void {
    if (this.customerForm.valid) {
      this.customerService.createCustomer(this.customerForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/customers']);
            // Show success message
          },
          error: (err) => {
            // Handle and display errors
          }
        });
    }
  }
}
```

## Testing Checklist
- [ ] Email uniqueness validation works
- [ ] Email format validation works
- [ ] Phone format validation works
- [ ] Default status is 'Active'
- [ ] Welcome email is sent
- [ ] Error messages match APEX version
- [ ] Navigation after save matches APEX
```

---

## 🎯 Step 5: Study the Migration Guide (1 hour)

Read the comprehensive guide to understand the full approach.

### Key Sections to Focus On:

1. **Section 1**: Workflow Inventory (you just did this!)
2. **Section 2**: Extract Business Logic from PL/SQL
3. **Section 4**: Strangler Fig Pattern (coexistence strategy)
4. **Section 6**: REST API Design
5. **Section 7**: Angular Frontend Architecture

**File**: `.github/agents/apex-to-dotnet-migration-guide.md`

---

## 📋 Today's Checklist

Complete these tasks today:

- [ ] Install Sample Database Application in APEX
- [ ] Run the app and explore one workflow
- [ ] Create workflow inventory document for ONE workflow
- [ ] Explore SQL Workshop → Object Browser
- [ ] Look at the tables used by your workflow
- [ ] Sketch the .NET API design for your workflow
- [ ] Read sections 1, 2, and 4 of the migration guide

---

## 💡 Pro Tips

### Start Simple
Pick the **simplest** workflow you can find:
- ✅ Simple form with 3-5 fields
- ✅ Basic validations (required, format)
- ✅ Single table operation
- ❌ Avoid complex reports initially
- ❌ Avoid workflows with many integrations

### Document Everything
Take screenshots, write notes, capture:
- Page flows and navigation
- Field validations and error messages
- Button actions and behaviors
- PL/SQL code snippets

### Think in Layers
When planning the .NET version:
- **Controller**: HTTP endpoints (thin layer)
- **Service**: Business logic (where APEX PL/SQL moves)
- **Repository**: Database operations (simple CRUD)
- **Model**: Data entities (match APEX tables)

---

## 🆘 Need Help?

### Common Questions:

**Q: Which sample app should I start with?**
A: "Sample Database Application" - it has clear CRUD operations

**Q: What if I can't find PL/SQL code?**
A: It might be in page processes, validations, or computations. Check:
- Page Designer → Processing → Processes
- Page Designer → Processing → Validations
- Shared Components → Application Processes

**Q: How detailed should my workflow inventory be?**
A: Very detailed! It's your blueprint for the .NET version. Include:
- Every field, validation, and error message
- All PL/SQL code snippets
- Navigation flows
- Authorization rules

**Q: What if the workflow is too complex?**
A: Start with a simpler one! Look for:
- Single page forms
- Simple list/detail views
- Basic CRUD operations

---

## 🎯 Success Metric for Today

**Goal**: Complete ONE workflow inventory document

You'll know you're successful when you can answer:
- What pages are involved?
- What data tables are used?
- What business logic exists?
- What validations are required?
- How would this look as a .NET API?

---

## 📚 Reference Files

Keep these open while working:
- `GETTING_STARTED_CLOUD_APEX.md` - General guidance
- `QUICK_REFERENCE.md` - Quick patterns lookup
- `.github/agents/apex-to-dotnet-migration-guide.md` - Full methodology

---

## ⏭️ After Today

Once you complete your first workflow inventory:
1. Review it for completeness
2. Show it to someone for feedback
3. Use it as a template for other workflows
4. Start planning the .NET implementation

**Tomorrow**: Set up your .NET development environment!

---

Ready to begin? Start by logging into your APEX workspace and installing the Sample Database Application! 🚀

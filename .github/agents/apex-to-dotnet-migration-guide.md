# APEX to .NET/Angular Migration Guide - Copilot Agent Instructions

This document provides comprehensive instructions for Copilot Agent Mode to guide the migration of Oracle APEX applications to Angular/.NET architecture following enterprise best practices and proven migration patterns.

## 1) Start with a Feature/Workflow Inventory (Not Pages)

### Goal
Convert the app by user workflows (end-to-end journeys), not by APEX pages.

### What to Capture Per Workflow

#### Entry Points
- Menus and navigation links
- Deep-links and external entry points
- URL routing patterns
- Authentication/authorization gates

#### Data Entities
- Tables and views touched by the workflow
- Data validations and constraints
- Computations and calculated fields
- Default values and auto-populated data

#### Security & Authorization
- Role-based access control rules
- Authorization schemes
- Condition-based access logic
- Data-level security rules

#### Reports & Forms Interactions
- Interactive reports configuration
- Form layouts and field types
- File upload/download capabilities
- Export formats (PDF, Excel, CSV)
- Print functionality

#### Integrations
- ORDS/REST endpoints
- External service calls
- Email notifications and jobs
- Scheduled processes and automations
- Background job dependencies

### Why This Approach?

APEX pages are often "composed" of region components and dynamic actions. Rebuilding page-by-page tends to create:
- Inconsistent user experience
- Broken end-to-end journeys
- Fragmented functionality

This workflow-first approach aligns with Angular migration guidance emphasizing "complete experiences/workflows" to avoid confusing customers during rollout.

---

## 2) Extract the Domain and Rules Out of APEX/PL-SQL (The Real Asset)

### What APEX Apps Typically Embed

#### SQL in Report Regions
- Complex queries with business logic
- Aggregations and calculations
- Filtering and sorting logic

#### PL/SQL Blocks
- Process validations
- Before/after submission logic
- Dynamic field calculations
- Conditional computations

#### Authorization Schemes
- Role-based access logic
- Condition evaluation
- Context-dependent permissions

#### Session State Dependencies
- APEX item values and application items
- Session-scoped variables
- Transient state management

### Refactor Target

#### Move Business Rules to Domain/Service Layer
- Create a C# domain model
- Implement business logic in service classes
- Keep database logic truly data-centric
- Use stored procedures/views only for database operations

#### Create Contract-First API Boundary
- Define OpenAPI specifications
- Establish clear API contracts
- Separate UI concerns from business logic
- Enable independent testing of API layer

### Key Anti-Pattern to Avoid

**DO NOT** rebuild the UI while leaving all business logic "hidden" in scattered SQL blocks.

**DO** consolidate logic so it can be:
- Tested independently
- Evolved over time
- Reused across different UIs
- Understood by the team

---

## 3) Choose a Migration Strategy: Strangler Fig (Recommended) vs. Big Bang

### Strangler Pattern (Incremental) - **RECOMMENDED**

#### How It Works
1. Keep APEX running in production
2. Introduce new Angular pages/workflows one by one
3. Route users to the new UI for migrated workflows
4. Leave non-migrated workflows in APEX until replaced
5. Gradually "strangle" the old system

#### Benefits
- Reduced risk with incremental rollout
- Continuous user feedback
- Ability to pause/adjust based on learning
- No long freeze windows
- Business continuity maintained

#### When to Use
- Most APEX to .NET migrations
- Apps with complex workflows
- Systems with many integrations
- When you need to maintain business operations

This mirrors internal "rolling migration vs. one massive switch over" guidance in Angular modernization best practices.

### Big Bang (Rarely Worth It)

#### When to Consider
Only do it if **ALL** of the following are true:
- The app is small (< 10 workflows)
- Low integration complexity
- You can accept a long freeze window (weeks/months)
- Strong test coverage exists
- Team has complete domain knowledge

#### Risks
- All-or-nothing deployment
- Long testing cycles
- High user disruption
- Difficult rollback
- Extended code freeze

---

## 4) Build the Target Architecture with Clear Seams

### Backend (.NET)

#### Common Enterprise Baseline

**Framework & Structure**
- ASP.NET Core Web API
- Clean Architecture / Layered structure
  - API Layer (Controllers, Middleware)
  - Application Layer (Use Cases, DTOs)
  - Domain Layer (Entities, Business Rules)
  - Infrastructure Layer (Data Access, External Services)

**Authentication & Authorization**
- Entra ID (Azure AD) / JWT tokens
- Policy-based authorization
- Role/claim-based access control
- API key management for service-to-service

**Observability**
- OpenTelemetry integration
- Structured logging (Serilog/NLog)
- Application Insights or similar APM
- Health checks and readiness probes

**Additional Patterns**
- Dependency injection
- Repository/Unit of Work patterns
- CQRS for complex domains
- MediatR for request handling

### Frontend (Angular)

#### Feature-Module Organization
- Organize by workflow, not technical layer
- Lazy-loaded feature modules
- Shared module for common functionality
- Core module for singleton services

#### Shared Component Library
- Design system implementation
- Reusable UI components
- Consistent styling/theming
- Accessibility built-in

#### State Management
- NgRx for complex state
- Signals-based approach for simpler scenarios
- Component store for feature-scoped state
- Service-based state for simple cases

#### Strong Form Patterns
- Reactive forms (not template-driven)
- Custom validators
- Error handling and messaging
- Dirty checking and change detection

### Important Consideration

**APEX does a lot "for free":**
- Built-in grid components
- Automatic validations
- Session state management
- Interactive reports

**In Angular/.NET, you must explicitly recreate these capabilities:**

Build foundational UI patterns early:
- Data tables with sorting/filtering
- Pagination components
- Inline editing capabilities
- Validation summary displays
- Role-based UI gating
- Loading states and error boundaries

---

## 5) Handle the "APEX UI is Metadata" Problem Explicitly

### The Challenge

APEX UI is essentially metadata - declarative configuration that generates runtime UI. Taking this and producing Angular components that "look right" with consistent placement/behavior is the hard part.

### Don't Pretend It's Automated

**Instead:**

#### Treat APEX UI as Reference Behavior
- Document existing behavior thoroughly
- Capture screenshots and user flows
- Record edge cases and error states
- Note performance characteristics

#### Create a UI Spec Pack Per Workflow

**For each workflow, document:**
- Screenshots of key screens
- Component behaviors and interactions
- Validation rules and messages
- Error handling patterns
- Accessibility expectations (WCAG 2.1 AA minimum)
- Performance expectations
  - Page load times
  - Search/query latency
  - Acceptable response times

#### Build a Component Mapping

Create explicit mappings from APEX to Angular:

| APEX Component | Angular Implementation |
|----------------|------------------------|
| Interactive Report | Angular Data Grid + server-side query API |
| Dynamic Actions | Angular events/services with RxJS |
| Page Processes | API calls + backend validation |
| Page Items | Reactive form controls |
| Validations | Angular validators + backend validation |
| Computations | Computed signals or form value subscriptions |
| Authorization Schemes | Route guards + directive-based UI hiding |
| LOV (List of Values) | Dropdown/autocomplete components |

### If You Attempt Automation (Copilot/Agents)

#### Constrain It Appropriately
- Generate scaffolding and component stubs
- Accelerate repetitive layout and boilerplate
- Create initial API contracts from schema
- Generate TypeScript interfaces from DTOs

#### Keep Humans Responsible For
- UX parity and consistency
- Edge cases and error scenarios
- Accessibility compliance
- Performance optimization
- User acceptance

---

## 6) Data and Integration Strategy (Usually Oracle Stays... At First)

### Database Strategy

Many APEX shops stay on Oracle DB initially.

#### Oracle .NET Integration
- Use ODP.NET (Oracle Data Provider for .NET)
- Or use Entity Framework Core with Oracle provider
- Create thin data-access abstraction layer
- Design for potential future database migration

#### Data Access Patterns
```
Application Layer → Repository Interfaces
Infrastructure Layer → Repository Implementations (Oracle-specific)
```

This allows later migration to different database technology if desired.

### Integration Points to Identify

#### Scheduled Jobs
- **APEX Automations** → Background workers
  - Hangfire (for .NET background processing)
  - Azure Functions (serverless)
  - Kubernetes CronJobs
  - AWS Lambda scheduled events

#### Email & Report Exports
- **Email notifications** → Dedicated email service
  - SendGrid / Azure Communication Services
  - SMTP with retry logic
  
- **Report exports** → Reporting service
  - Crystal Reports / SSRS
  - Custom PDF generation (iText, PDFSharp)
  - Excel generation (EPPlus, ClosedXML)

#### REST Endpoints
- **ORDS endpoints** → .NET APIs
  - Option 1: Keep ORDS temporarily (if working well)
  - Option 2: Reimplement in .NET for consistency
  - Consider API versioning strategy

#### External Services
- Document all external integrations
- Maintain existing protocols where possible
- Update authentication methods if needed (OAuth 2.0, API keys)

---

## 7) Testing: Prove Parity, Not Just "It Compiles"

You need behavioral equivalence between APEX and the new system.

### Golden Path Testing

#### For Each Workflow
1. Record "input → output" examples from APEX
2. Create automated integration tests against .NET APIs
3. Verify same inputs produce same outputs
4. Test with production-like data volumes

#### Test Levels
```
Unit Tests → Domain logic, validation rules
Integration Tests → API endpoints, database queries
E2E Tests → Complete user workflows
Performance Tests → Response times, load handling
```

### UI Regression Testing

#### Snapshot Testing
- Critical screens and components
- Visual regression testing (Percy, Chromatic)
- Responsive design validation
- Cross-browser compatibility

#### End-to-End Tests
- Playwright or Cypress for automation
- Test top user journeys
- Include authentication flows
- Test error conditions

### Data Correctness Validation

#### Reconciliation Testing
- Compare aggregates/reports between APEX and Angular/.NET
- Use same filters and date ranges
- Verify calculations match
- Check edge cases (nulls, zeros, negatives)

#### Migration Validation
- If migrating data, validate 100% accuracy
- Check referential integrity
- Verify computed values
- Audit critical business metrics

---

## 8) Cutover Mechanics: Routing, Identity, and Coexistence

### Typical Coexistence Patterns

#### Portal Shell Approach
- Create a portal/shell application
- Links route to either APEX or Angular routes
- Seamless navigation between systems
- Consistent header/footer/navigation

#### Single Sign-On (SSO)
- Entra ID (Azure AD) for unified identity
- Consistent authorization model across systems
- Share session/token between APEX and Angular
- Centralized user management

#### Shared Navigation & Styling
- Consistent design language
- Same menu structure (with mixed destinations)
- Unified branding and theme
- Users shouldn't feel "two apps"

### Technical Implementation

#### Routing Strategy
```
/legacy/*  → APEX application
/app/*     → Angular application
/api/*     → .NET API
```

#### Session Sharing
- JWT tokens shared between systems
- SSO provider handles authentication
- Authorization claims passed to both systems

#### Feature Flags
- Control rollout of new workflows
- A/B testing capabilities
- Quick rollback if issues arise
- Gradual user migration

---

## 9) Delivery Plan (What to Actually Do in the First 4 "Sprints")

### Sprint 0 (Foundation) - 2 weeks

#### Discovery & Setup
- **Inventory workflows** - Complete workflow mapping exercise
- **Pick 1-2 pilot workflows** - Choose representative but manageable workflows
  - Criteria: Medium complexity, high user value, clear boundaries
  
#### Technical Foundation
- **Set up repository structure**
  - Frontend (Angular) repo
  - Backend (.NET) repo
  - Or mono-repo with clear separation
  
- **CI/CD pipelines**
  - Build automation
  - Test execution
  - Deployment to dev/test environments
  
- **Environments**
  - Development
  - Testing/QA
  - Staging
  - Production (coexistence setup)

#### Standards & Conventions
- **Define API standards**
  - RESTful conventions
  - OpenAPI specification format
  - Error response format
  - Versioning strategy
  
- **Logging & monitoring**
  - Log format and levels
  - Correlation IDs
  - Performance metrics
  - Error tracking

### Sprint 1 (First Workflow End-to-End) - 2 weeks

#### Authentication & Authorization
- Implement Entra ID integration
- Set up JWT token handling
- Create authorization policies
- Test SSO with APEX

#### Base Layout & Components
- Create shell application
- Implement navigation structure
- Build shared component library
  - Buttons, inputs, dropdowns
  - Data grid component
  - Modal dialogs
  - Loading indicators

#### First Workflow Implementation
- Build complete end-to-end for pilot workflow
- UI (Angular) → API (.NET) → Database
- Extract business rules from APEX/PL-SQL
- Implement in domain/service layer

#### Test Harness
- Set up test framework
- Create parity checks against APEX
- Automated integration tests
- UI automation for critical path

### Sprint 2-3 (Scale Out) - 4 weeks

#### Add Next Workflows
- Implement 2-3 additional workflows
- Reuse components from Sprint 1
- Identify common patterns
- Refactor for consistency

#### Extract & Consolidate Logic
- Extract PL/SQL rules into C# services
- Consolidate scattered SQL into repository layer
- Create domain model for business entities
- Unit test business logic

#### Reporting & Grid Patterns
- Advanced data grid features
  - Sorting, filtering, pagination
  - Column configuration
  - Export functionality
  
- Performance tuning
  - Query optimization
  - Caching strategy
  - Lazy loading
  - API response time targets

#### Integration & Cutover Prep
- Set up coexistence routing
- Test feature flags
- User acceptance testing
- Performance testing under load

### Pilot Then Scale Approach

This "pilot then scale" approach aligns with internal guidance that refactor/rebuild decisions should support:
- Business agility
- Continuous innovation
- DevOps practices
- Incremental delivery
Rather than a single monolithic release.

---

## 10) Use Internal Learnings You Already Have

### Relevant Internal References

#### Angular Migration Best Practices
**"Rolling Migration" & "Complete Workflows" Principle**

From the AMC Angular migration deck (even though it discusses moving off AngularJS, the rollout mechanics are directly applicable):
- Migrate complete workflows, not individual pages
- Rolling migration reduces risk
- Maintain user experience continuity
- Avoid "big bang" deployments
- Plan for coexistence period

#### XAP Migration Case Study
**Hybrid Approach to Reduce Risk**

Shows a "hybrid" approach to reduce risk while transitioning runtimes:
- Conceptually similar to coexisting APEX + new stack
- Phased migration approach
- Risk mitigation through incremental delivery
- Maintaining business continuity

### .NET Framework → Modern .NET Guidance

If doing any .NET Framework → modern .NET component work in parallel:

#### Microsoft's Updated Guidance
- **API Port is deprecated** - Use newer binary analysis tools
- Structured porting approaches
  - Bottom-up migration
  - Compatibility analysis
  - Incremental testing

#### Key Resources
- learn.microsoft.com - Modern .NET porting guides
- Binary analysis tools for compatibility checks
- Migration patterns and practices

---

## Summary: Key Principles

### 1. Workflow-First
Think in complete user journeys, not pages or components.

### 2. Extract Business Logic
The real asset is the domain knowledge, not the UI metadata.

### 3. Incremental Migration
Strangler Fig pattern over Big Bang.

### 4. Clear Architecture
Explicit seams between layers, testable components.

### 5. Parity Testing
Prove behavioral equivalence, not just functionality.

### 6. Coexistence Planning
Plan for APEX and Angular/.NET running side-by-side.

### 7. Pilot and Learn
Start small, validate approach, then scale.

### 8. User-Centric
Focus on maintaining/improving user experience through the transition.

---

## Copilot Agent Guidance

When using this guide as a Copilot Agent:

1. **Always start with workflow inventory** - Don't jump to code generation
2. **Ask clarifying questions** about business rules and workflows
3. **Generate test cases first** based on APEX behavior
4. **Create OpenAPI specs** before implementing APIs
5. **Scaffold Angular components** based on workflow mappings
6. **Extract business logic** into separate service classes
7. **Validate parity** with original APEX behavior
8. **Document decisions** and assumptions made during migration
9. **Flag complexity** when automated migration is insufficient
10. **Recommend manual review** for critical business logic and security rules

### Agent Workflow Template

```
1. Analyze APEX workflow
   ↓
2. Document current behavior
   ↓
3. Design .NET API contract
   ↓
4. Extract business rules → C# domain/services
   ↓
5. Create Angular component structure
   ↓
6. Generate test cases for parity
   ↓
7. Implement and validate
   ↓
8. Review and iterate
```

---

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Maintained By:** Migration Team

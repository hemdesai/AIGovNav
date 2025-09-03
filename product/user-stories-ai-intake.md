# AI Use-Case Intake & Registry - User Stories

## Epic: AI Use-Case Intake & Registry System
**Goal**: Provide a comprehensive intake workflow that captures AI use-case details, performs automated risk classification per EU AI Act, and maintains a searchable registry of all AI systems.

---

## Core User Stories

### 1. AI Use-Case Submission
**As a** Product Manager/AI Developer  
**I want to** submit a new AI use-case through a structured intake form  
**So that** the system can capture all necessary details for governance assessment

**Acceptance Criteria:**
- Intake form captures: project name, description, business purpose, target users
- Fields for AI model type (traditional ML, GenAI/LLM, computer vision, etc.)
- **Actor role selection**: Provider, Deployer, or Importer (per EU AI Act definitions)
- **Data residency**: EU, US, Other (with specific country selection)
- **Data controller/processor status**: Controller, Processor, or Joint Controller
- **GPAI flag**: Yes/No (triggers additional requirements if Yes)
- Data sources and types (personal data, sensitive categories)
- Deployment context (internal tool, customer-facing, decision automation)
- Expected go-live date and development stage
- **EU Database Registration ID** field (optional, becomes required for High-Risk + Provider)
- Auto-saves draft submissions
- Generates unique AI system ID upon submission
- Sends confirmation email with submission details

---

### 2. Automated EU AI Act Risk Classification
**As a** Compliance Officer  
**I want** the system to automatically classify AI use-cases by EU AI Act risk levels  
**So that** high-risk systems are identified immediately and routed for appropriate governance

**Acceptance Criteria:**
- Automated classification engine checks against Annex III categories
- Classifies as: Prohibited, High-Risk, Limited Risk, or Minimal Risk
- Provides classification rationale with specific EU AI Act articles referenced
- Flags systems that may qualify as General Purpose AI (GPAI)
- Allows manual override with documented justification
- Triggers different workflows based on risk level
- Generates risk classification certificate/report
- **If High-Risk + Provider**: Creates mandatory EU Database registration task before status can be "Approved"
- **If GPAI = Yes**: Requires Training Data Summary and IP clearance documentation before "Approved"
- **Re-classification on material change**: Automatically re-runs classifier when key fields change
- **Diff tracking**: Stores rationale differences between classifications
- **Auto status reversion**: Changes status to "Under Review" after re-classification

---

### 3. AI Registry Dashboard
**As a** Risk Manager  
**I want to** view all AI systems in a centralized registry dashboard  
**So that** I can monitor our AI portfolio and compliance status

**Acceptance Criteria:**
- Searchable/filterable registry by: risk level, department, status, dates, actor role, data residency
- Visual risk distribution (pie chart of risk categories)
- Status indicators (Draft, Under Review, Approved, In Production, Retired)
- Quick access to system details and documentation
- Export functionality (CSV, PDF) for reporting
- **One-click "EU Intake Package" export**: Generates PDF with risk certificate, applicable controls list, documentation checklist
- Role-based visibility (e.g., only see systems in your department)
- Audit trail of all changes to registry entries
- **EU Database registration status tracking** for High-Risk Provider systems
- **GPAI compliance indicators** showing Training Data Summary and IP clearance status

---

### 4. Intake Workflow Routing
**As a** System Administrator  
**I want** submitted use-cases to automatically route to appropriate reviewers  
**So that** the right stakeholders are engaged based on risk level

**Acceptance Criteria:**
- High-risk systems auto-assign to Legal and Risk teams
- GenAI/LLM systems route to AI Ethics board
- Configurable routing rules per organization structure
- Email notifications to assigned reviewers with deadlines
- Escalation if review SLAs are missed
- Parallel review tracks (e.g., Legal + Technical + Ethics)
- Consolidated review comments visible to submitter

---

### 5. Documentation Requirements Check
**As a** Legal Counsel  
**I want** the system to enforce documentation requirements based on risk classification  
**So that** we comply with EU AI Act documentation mandates

**Acceptance Criteria:**
- Checklist of required documents per risk level
- For high-risk: technical documentation, conformity assessment, registration
- For GPAI: model cards, systemic risk assessment
- Document upload with versioning
- Validation that mandatory fields are complete
- Warning when documents are missing or outdated
- Auto-generation of documentation templates
- Integration with document management systems

---

### 6. Pre-Submission Risk Estimator
**As a** Product Manager  
**I want to** estimate the risk classification before formal submission  
**So that** I can understand governance requirements early in planning

**Acceptance Criteria:**
- Simplified questionnaire (5-7 questions) for quick assessment
- Instant preliminary risk level indication
- Explanation of what drives the risk classification
- Recommendations for risk mitigation
- Option to save and convert to full submission
- Links to relevant policy documentation
- No audit trail for preliminary assessments (sandbox mode)

---

### 7. Bulk Import of Existing AI Systems
**As a** IT Administrator  
**I want to** import our existing AI inventory via CSV/API  
**So that** we can quickly populate the registry without manual entry

**Acceptance Criteria:**
- CSV template with all required fields
- Validation of imported data with error reporting
- Batch risk classification of imported systems
- Mapping tool for field alignment
- Preview before committing import
- Rollback capability if import has errors
- API endpoint for programmatic submission
- Import history log

---

### 8. AI System Lifecycle Management
**As a** AI System Owner  
**I want to** update the status of my AI system through its lifecycle  
**So that** the registry reflects current deployment state

**Acceptance Criteria:**
- Status transitions: Planning → Development → Testing → Production → Retired
- Required approvals for status changes (configurable)
- Automatic notifications on status changes
- Historical timeline of all status changes
- Ability to clone existing entries for similar systems
- Archive retired systems (maintain for compliance)
- Reactivation process for archived systems

---

### 9. Compliance Gap Analysis
**As a** Compliance Officer  
**I want** the system to identify compliance gaps for each AI use-case  
**So that** we know what actions are needed for EU AI Act compliance

**Acceptance Criteria:**
- Gap analysis against EU AI Act requirements
- Prioritized action items with deadlines
- Assignment of remediation tasks to team members
- Progress tracking on gap closure
- Compliance score/percentage for each system
- Heat map visualization of compliance gaps
- Integration with project management tools

---

### 10. Registry Search and Discovery
**As a** Data Scientist  
**I want to** search existing AI systems by various attributes  
**So that** I can find similar implementations and reuse components

**Acceptance Criteria:**
- Full-text search across all fields
- Advanced filters: model type, data sources, risk level, department
- Saved search queries
- Similar system recommendations
- Technology stack visibility
- Contact information for system owners
- API/component reusability indicators
- Knowledge base of lessons learned

---

## Technical Requirements

### Data Model
- **AI_System**: id, name, description, purpose, risk_level, status, created_date, owner_id, actor_role, data_residency, controller_processor_status, gpai_flag, eu_db_registration_id
- **Risk_Assessment**: id, system_id, classification, rationale, override_reason, assessed_date, previous_classification, classification_diff
- **Documentation**: id, system_id, doc_type, file_url, version, upload_date, required_for_approval
- **Audit_Log**: id, system_id, user_id, action, timestamp, details
- **EU_Database_Registration**: id, system_id, registration_status, submission_date, registration_id, owner_contact, intended_purpose

### Integrations
- **SSO/SAML**: Okta, Azure AD, Auth0
- **Document Storage**: SharePoint, S3, Google Drive
- **Workflow**: ServiceNow, Jira
- **Notifications**: Email (SMTP), Slack, MS Teams

### Non-Functional Requirements
- Response time < 2 seconds for searches
- Support 10,000+ AI systems in registry
- 99.9% uptime SLA
- GDPR-compliant data handling
- Multi-tenant architecture
- API rate limiting: 1000 requests/minute

---

## Success Metrics
- Time to complete intake: < 15 minutes
- Auto-classification accuracy: > 95%
- User adoption: 80% of AI projects registered within 30 days
- Compliance readiness: 100% of high-risk systems with complete documentation
- Mean time to review: < 3 business days
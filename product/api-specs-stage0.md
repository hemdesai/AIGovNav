# API Specifications - Stage 0 MVP

## Overview
This document defines the REST API specifications for the AI Governance Navigator Stage 0 features: AI Use-Case Intake & Registry, EU AI Act Policy Pack, and RBAC & SSO integration.

---

## Base Configuration

### API Version
- Version: `v1`
- Base URL: `https://api.aigovnav.com/v1`
- Content-Type: `application/json`

### Authentication
- Bearer token (JWT) required for all endpoints
- Token includes tenant_id, user_id, roles, permissions
- Token expiration: 1 hour (configurable)
- Refresh token: 24 hours

### Response Headers
All responses include:
```
X-Request-ID: <uuid>
X-Rate-Limit-Remaining: <number>
X-Effective-Permissions: <comma-separated-list>
X-SoD-Policy-Applied: <true|false>
```

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},
    "request_id": "uuid",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

---

## 1. Intake API

### 1.1 Create AI Use-Case Intake

**POST** `/intake`

Creates a new AI use-case intake submission.

#### Request Body
```json
{
  "name": "Customer Service Chatbot",
  "description": "AI-powered customer support system",
  "business_purpose": "Automate customer inquiries",
  "actor_role": "PROVIDER" | "DEPLOYER" | "IMPORTER",
  "data_residency": "EU" | "US" | "OTHER",
  "data_residency_country": "string (if OTHER)",
  "controller_processor_status": "CONTROLLER" | "PROCESSOR" | "JOINT_CONTROLLER",
  "gpai_flag": true | false,
  "model_type": "LLM" | "ML" | "COMPUTER_VISION" | "NLP" | "OTHER",
  "data_sources": ["CRM", "Support Tickets"],
  "personal_data": true | false,
  "sensitive_categories": ["health", "biometric"],
  "deployment_context": "INTERNAL" | "CUSTOMER_FACING" | "DECISION_AUTOMATION",
  "target_users": ["employees", "customers"],
  "expected_go_live": "2024-06-01",
  "development_stage": "PLANNING" | "DEVELOPMENT" | "TESTING" | "PRODUCTION",
  "department": "Customer Service",
  "owner_email": "owner@company.com",
  "eu_db_registration_id": "string (optional)"
}
```

#### Response
```json
{
  "id": "intake_abc123",
  "system_id": "ai_sys_xyz789",
  "status": "DRAFT",
  "created_at": "2024-01-01T00:00:00Z",
  "created_by": "user_id",
  "risk_classification": null,
  "next_actions": ["complete_documentation", "submit_for_review"]
}
```

### 1.2 Run Risk Classification

**POST** `/intake/{id}/classify`

Triggers automated EU AI Act risk classification.

#### Request Body
```json
{
  "override_classification": "HIGH_RISK" (optional),
  "override_rationale": "string (required if override)"
}
```

#### Response
```json
{
  "intake_id": "intake_abc123",
  "classification": {
    "risk_level": "HIGH_RISK" | "LIMITED_RISK" | "MINIMAL_RISK" | "PROHIBITED",
    "is_gpai": true | false,
    "annex_iii_categories": ["biometric_identification", "credit_scoring"],
    "rationale": "System falls under Annex III Category 1(a)...",
    "eu_act_articles": ["Article 6", "Annex III"],
    "confidence_score": 0.95,
    "previous_classification": {
      "risk_level": "LIMITED_RISK",
      "timestamp": "2024-01-01T00:00:00Z",
      "diff": ["risk_level changed from LIMITED to HIGH"]
    }
  },
  "required_actions": {
    "eu_database_registration": true,
    "training_data_summary": true,
    "ip_clearance": true,
    "conformity_assessment": true,
    "notified_body": false
  },
  "status": "UNDER_REVIEW",
  "workflow_assignments": [
    {
      "role": "LEGAL",
      "assigned_to": "legal_team",
      "due_date": "2024-01-15"
    }
  ]
}
```

### 1.3 Submit Intake

**POST** `/intake/{id}/submit`

Submits intake for formal review and approval.

#### Request Body
```json
{
  "comments": "Ready for review",
  "urgency": "HIGH" | "NORMAL" | "LOW"
}
```

#### Response
```json
{
  "intake_id": "intake_abc123",
  "status": "UNDER_REVIEW",
  "submission_timestamp": "2024-01-01T00:00:00Z",
  "review_assignments": [
    {
      "reviewer_id": "user_123",
      "role": "COMPLIANCE_OFFICER",
      "due_date": "2024-01-08"
    }
  ],
  "sod_check": {
    "passed": true,
    "rules_evaluated": ["creator_cannot_approve"],
    "violations": []
  }
}
```

---

## 2. Registry API

### 2.1 List AI Systems

**GET** `/registry`

Returns paginated list of AI systems with filtering.

#### Query Parameters
- `page`: int (default: 1)
- `limit`: int (max: 100, default: 20)
- `risk_level`: HIGH_RISK | LIMITED_RISK | MINIMAL_RISK
- `status`: DRAFT | UNDER_REVIEW | APPROVED | IN_PRODUCTION | RETIRED
- `actor_role`: PROVIDER | DEPLOYER | IMPORTER
- `data_residency`: EU | US | OTHER
- `gpai`: true | false
- `department`: string
- `search`: string (full-text search)
- `sort`: created_at | updated_at | risk_level (default: -created_at)

#### Response
```json
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": "ai_sys_xyz789",
      "name": "Customer Service Chatbot",
      "risk_level": "HIGH_RISK",
      "status": "APPROVED",
      "actor_role": "PROVIDER",
      "data_residency": "EU",
      "gpai_flag": false,
      "owner": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@company.com"
      },
      "compliance_score": 85,
      "last_updated": "2024-01-01T00:00:00Z",
      "eu_db_registration": {
        "required": true,
        "status": "SUBMITTED",
        "registration_id": "EU-2024-001"
      }
    }
  ]
}
```

### 2.2 Get AI System Details

**GET** `/registry/{id}`

Returns detailed information about a specific AI system.

#### Response
```json
{
  "id": "ai_sys_xyz789",
  "intake_id": "intake_abc123",
  "name": "Customer Service Chatbot",
  "full_details": "...", // All intake fields
  "risk_assessment": {
    "current": { /* classification object */ },
    "history": []
  },
  "documentation": [
    {
      "id": "doc_123",
      "type": "TECHNICAL_DOCUMENTATION",
      "name": "Technical Specification v1.2",
      "url": "/documents/doc_123",
      "version": "1.2",
      "required_for_approval": true,
      "status": "APPROVED"
    }
  ],
  "compliance_gaps": [
    {
      "requirement": "Training Data Summary",
      "status": "MISSING",
      "due_date": "2024-02-01"
    }
  ],
  "audit_trail": [
    {
      "action": "CLASSIFICATION_CHANGED",
      "timestamp": "2024-01-01T00:00:00Z",
      "user": "system",
      "details": "Risk level changed from LIMITED to HIGH"
    }
  ]
}
```

### 2.3 Update Lifecycle Status

**PUT** `/registry/{id}/lifecycle`

Updates the lifecycle status of an AI system.

#### Request Body
```json
{
  "new_status": "IN_PRODUCTION",
  "effective_date": "2024-02-01",
  "comments": "Deployment approved by review board"
}
```

#### Response
```json
{
  "id": "ai_sys_xyz789",
  "previous_status": "APPROVED",
  "new_status": "IN_PRODUCTION",
  "transition_timestamp": "2024-01-01T00:00:00Z",
  "sod_check": {
    "passed": true,
    "approver_different_from_creator": true
  },
  "notifications_sent": ["owner@company.com", "compliance@company.com"]
}
```

### 2.4 Export Registry

**POST** `/registry/export`

Generates an export of registry data.

#### Request Body
```json
{
  "format": "CSV" | "PDF" | "EU_INTAKE_PACKAGE",
  "filters": {
    "risk_level": ["HIGH_RISK"],
    "status": ["APPROVED", "IN_PRODUCTION"]
  },
  "include_fields": ["name", "risk_level", "status", "compliance_score"]
}
```

#### Response
```json
{
  "export_id": "export_123",
  "format": "EU_INTAKE_PACKAGE",
  "status": "PROCESSING",
  "download_url": null,
  "estimated_completion": "2024-01-01T00:05:00Z"
}
```

---

## 3. Policy Pack API

### 3.1 Get Applicable Controls

**GET** `/policy-pack/controls`

Returns controls applicable to a specific risk classification.

#### Query Parameters
- `risk_level`: HIGH_RISK | LIMITED_RISK | MINIMAL_RISK (required)
- `actor_role`: PROVIDER | DEPLOYER | IMPORTER
- `gpai`: true | false
- `include_optional`: true | false (default: false)

#### Response
```json
{
  "risk_level": "HIGH_RISK",
  "total_controls": 45,
  "mandatory_controls": 38,
  "optional_controls": 7,
  "controls": [
    {
      "id": "ctrl_001",
      "article": "Article 10",
      "title": "Data Governance",
      "description": "Training, validation and testing data sets...",
      "category": "DATA_CONTROLS",
      "implementation_guide": "...",
      "evidence_requirements": ["data_quality_report", "bias_assessment"],
      "automation_available": true,
      "estimated_effort": "MEDIUM"
    }
  ],
  "compliance_timeline": {
    "immediate": 15,
    "30_days": 20,
    "90_days": 10
  }
}
```

### 3.2 Generate Annex VIII Index

**POST** `/policy-pack/annex-viii-index`

Generates a numbered table of contents mapping Article 11/Annex VIII sections to evidence.

#### Request Body
```json
{
  "system_id": "ai_sys_xyz789",
  "include_gaps": true
}
```

#### Response
```json
{
  "system_id": "ai_sys_xyz789",
  "generated_at": "2024-01-01T00:00:00Z",
  "index": [
    {
      "section_number": "1",
      "section_title": "General description of the AI system",
      "article_reference": "Article 11(1)(a)",
      "evidence_documents": [
        {
          "id": "doc_123",
          "name": "System Architecture Document",
          "status": "COMPLETE",
          "last_updated": "2024-01-01"
        }
      ],
      "compliance_status": "COMPLETE"
    },
    {
      "section_number": "2",
      "section_title": "Detailed description of the elements",
      "article_reference": "Article 11(1)(b)",
      "evidence_documents": [],
      "compliance_status": "MISSING",
      "required_action": "Upload detailed element description"
    }
  ],
  "overall_completeness": 85,
  "missing_sections": 2,
  "export_url": "/exports/annex_viii_ai_sys_xyz789.pdf"
}
```

### 3.3 Generate EU Database Package

**POST** `/policy-pack/eu-database-package`

Generates complete package for EU Database registration.

#### Request Body
```json
{
  "system_id": "ai_sys_xyz789",
  "notified_body_id": "NB-2024-001" (optional)
}
```

#### Response
```json
{
  "package_id": "pkg_123",
  "system_id": "ai_sys_xyz789",
  "generated_at": "2024-01-01T00:00:00Z",
  "contents": {
    "registration_form": {
      "owner": "ACME Corp",
      "contact": "compliance@acme.com",
      "intended_purpose": "Customer service automation",
      "conformity_module": "MODULE_B",
      "notified_body": "NB-2024-001",
      "technical_file_reference": "TF-2024-001"
    },
    "supporting_documents": [
      "Technical Documentation",
      "Conformity Assessment Report",
      "Risk Assessment"
    ],
    "validation_status": {
      "all_required_fields": true,
      "document_completeness": true,
      "ready_for_submission": true
    }
  },
  "download_url": "/exports/eu_db_package_123.zip",
  "submission_checklist": [
    {
      "item": "Owner details",
      "status": "COMPLETE"
    },
    {
      "item": "Technical documentation",
      "status": "COMPLETE"
    }
  ]
}
```

---

## 4. Authorization & SoD API

### 4.1 Check Permissions

**POST** `/auth/permissions/check`

Checks if user has specific permissions including SoD policy evaluation.

#### Request Body
```json
{
  "user_id": "user_123",
  "resource_type": "AI_SYSTEM",
  "resource_id": "ai_sys_xyz789",
  "action": "APPROVE",
  "context": {
    "created_by": "user_456",
    "risk_level": "HIGH_RISK"
  }
}
```

#### Response
```json
{
  "allowed": false,
  "reason": "SOD_VIOLATION",
  "details": {
    "rule_violated": "creator_cannot_approve",
    "user_is_creator": false,
    "additional_approver_required": true,
    "suggested_approvers": ["user_789", "user_012"]
  },
  "effective_permissions": [
    "registry.read",
    "registry.update",
    "assessment.execute"
  ],
  "sod_policies_evaluated": [
    "creator_cannot_approve",
    "dual_approval_for_high_risk"
  ]
}
```

### 4.2 Get Effective Permissions

**GET** `/auth/permissions/effective`

Returns all effective permissions for the current user.

#### Query Parameters
- `resource_type`: AI_SYSTEM | POLICY | ASSESSMENT (optional)
- `resource_id`: string (optional)

#### Response
```json
{
  "user_id": "user_123",
  "roles": ["COMPLIANCE_OFFICER", "RISK_ASSESSOR"],
  "effective_permissions": {
    "global": [
      "registry.read",
      "registry.create",
      "policy.read",
      "assessment.execute"
    ],
    "resource_specific": {
      "ai_sys_xyz789": [
        "registry.update",
        "document.upload"
      ]
    }
  },
  "sod_restrictions": [
    {
      "rule": "creator_cannot_approve",
      "applies_to": ["ai_sys_abc123", "ai_sys_def456"]
    }
  ],
  "delegation_received": [
    {
      "from_user": "user_456",
      "permissions": ["assessment.approve"],
      "valid_until": "2024-02-01"
    }
  ]
}
```

---

## 5. Common Patterns

### 5.1 Pagination
All list endpoints support standard pagination:
```
?page=2&limit=50
```

Response includes:
```json
{
  "total": 500,
  "page": 2,
  "limit": 50,
  "has_next": true,
  "has_previous": true
}
```

### 5.2 Filtering
Complex filtering using query parameters:
```
?filter[risk_level]=HIGH_RISK&filter[status]=APPROVED&filter[gpai]=true
```

### 5.3 Field Selection
Sparse fieldsets for bandwidth optimization:
```
?fields=id,name,risk_level,status
```

### 5.4 Sorting
Multi-field sorting:
```
?sort=-risk_level,created_at
```

### 5.5 Rate Limiting
- 1000 requests per minute per user
- 10000 requests per minute per tenant
- Headers indicate remaining quota
- 429 status code when exceeded

### 5.6 Webhooks
Event notifications for async operations:
```json
{
  "webhook_url": "https://client.com/webhook",
  "events": ["classification.completed", "status.changed"],
  "secret": "webhook_secret_key"
}
```

---

## 6. Error Codes

| Code | Description | HTTP Status |
|------|-------------|------------|
| `INTAKE_NOT_FOUND` | Intake ID does not exist | 404 |
| `INVALID_RISK_LEVEL` | Invalid risk classification | 400 |
| `SOD_VIOLATION` | Segregation of duties policy violation | 403 |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions | 403 |
| `MISSING_REQUIRED_FIELDS` | Required fields not provided | 400 |
| `CLASSIFICATION_IN_PROGRESS` | Classification already running | 409 |
| `DOCUMENT_NOT_READY` | Required documents missing | 412 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

---

## 7. Security Considerations

### Headers
All requests must include:
```
Authorization: Bearer <token>
X-Tenant-ID: <tenant_id>
X-Request-ID: <uuid>
```

### Encryption
- All data encrypted in transit (TLS 1.3)
- Sensitive fields encrypted at rest
- Per-tenant encryption keys

### Audit
All API calls generate audit log entries including:
- User ID
- Action performed
- Resource affected
- Timestamp
- IP address (masked per PII controls)
- Success/failure status
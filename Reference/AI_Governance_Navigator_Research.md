# Deep Market Research --- AI Governance Navigator (SaaS) for Fortune-1000

## Executive Brief (≤500 words)

-   Build a **holistic AI governance SaaS** spanning **data → models
    (incl. LLMs) → decisions → deployment/ops**.
-   **Why now:** EU AI Act imminent; ISO/IEC 42001 launched; NIST AI RMF
    adopted; Colorado AI Act effective 2026.
-   **Where to build:** Focus EU-first wedge, expand to US/global MNCs.
-   **Competitive gaps:**
    -   Credo AI = policy libraries, compliance, guardrails.\
    -   IBM watsonx.governance = enterprise-grade, automation, broad
        lifecycle.\
    -   Monitaur = audit focus, regulated verticals.\
-   **Unmet needs:** LLM-specific governance, adversarial testing,
    post-market incident handling, consumer transparency.

------------------------------------------------------------------------

## Feature Matrix (Credo AI vs IBM watsonx.governance vs Monitaur)

  -------------------------------------------------------------------------------
  Capability             Credo AI          IBM                  Monitaur
                                           watsonx.governance   
  ---------------------- ----------------- -------------------- -----------------
  Policy/control library ✓ Extensive       ✓ Compliance         ✓ Insurance/FS
                         policy packs      accelerators         focus

  Risk                   ✓ Risk register & ✓ Risk scorecards    ✓ Validation
  taxonomy/registers     intake                                 scorecards

  EU AI Act mapping      ✓ Full pack       ✓ Accelerator        △ Limited

  NIST/ISO alignment     ✓ Yes             ✓ Yes                △ Partial

  Data lineage/catalogs  ✓ Basic           ✓ Factsheets         △ Minimal
                         integration                            

  Model registry         ✓ AI registry     ✓ Catalog &          ✓ Repository
                                           factsheets           

  LLM governance         ✓ Guardrails,     ✓ Eval metrics &     △ Limited
                         filters           guardrails           

  Testing/validation     ✓ Bias & quality  ✓ Fairness &         ✓ Validation
                         tests             explainability       workflows

  Approvals/HITL         ✓ Workflows       ✓ Policy approvals   ✓ Reviews

  Audit trails           ✓ Complete        ✓ Factsheets         ✓ Audit trails

  Monitoring/incidents   ✓ Alerts          ✓ Real-time          △ Partial

  Reporting              ✓ Compliance      ✓ Audit-ready        ✓ Regulator
                         reports                                reports

  RBAC/SoD               ✓ Roles           ✓ Enterprise RBAC    ✓ Access controls

  Vendor model risk      ✓ Vendor risk     △ Tracking only      ✓ Oversight
                         registry                               

  SDLC/MLOps             ✓ CI/CD hooks     ✓ Cloud Pak & APIs   △ Limited

  GRC integrations       △ Basic           ✓ OpenPages          △ Export only
                         (ServiceNow)                           

  Security               ✓ SOC2,           ✓ Enterprise-grade   ✓ SOC2
                         encryption                             

  Deployment             ✓ SaaS/on-prem    ✓ Hybrid             △ SaaS only

  Pricing                △ Custom          ✓ Flexible modules   ✓ Transparent
  -------------------------------------------------------------------------------

------------------------------------------------------------------------

## Regulatory Mapping (EU AI Act, NIST RMF, ISO 42001, OCC SR 11-7, Colorado AI Act)

### EU AI Act

-   **Providers (High-risk):** Risk management system, data governance,
    technical documentation, transparency, human oversight, logging.\
-   **Deployers (High-risk):** Use per instructions, train overseers,
    monitor/incident reporting, retain logs, transparency to end-users.\
-   **Providers (GPAI):** Publish training data summaries, ensure IP
    compliance, adversarial testing (for systemic models).\
    **Mapped Features:** Risk register, dataset bias tests, model cards,
    prompt/output logging, approval workflows, incident register.

### NIST AI RMF

-   **Govern:** Roles, policies, accountability.\
-   **Map:** Context, AI inventory, risk classification.\
-   **Measure:** Fairness, explainability, robustness, accuracy
    metrics.\
-   **Manage:** Risk mitigation workflows, monitoring, incident
    response.\
    **Mapped Features:** Policy packs, inventory, eval harness,
    monitoring dashboards.

### ISO/IEC 42001

-   **Providers:** Ethical design, dataset handling, documentation.\
-   **Producers:** Integration, validation, performance testing.\
-   **Users:** Responsible use, monitoring, feedback loop.\
    **Mapped Features:** Documentation, approval workflows, monitoring
    dashboards, feedback reporting.

### OCC SR 11-7 (Banking)

-   **Developers:** Document design, assumptions, validation results.\
-   **Validators:** Independent validation proportional to risk.\
-   **Senior Mgmt/Board:** Governance framework, model inventory,
    reporting, vendor models.\
    **Mapped Features:** Model documentation, validation workflows,
    inventory dashboards, reports.

### Colorado AI Act (2024/2026)

-   **Developers:** Document systems, bias mitigations, public
    disclosure, notify AG of discrimination.\
-   **Deployers:** Risk management program (aligned NIST/ISO), annual
    AIAs, user notices, incident reports.\
    **Mapped Features:** Impact assessment workflows, model cards,
    transparency notices, incident register.

------------------------------------------------------------------------

## Buyer Problems & JTBD (by Industry)

### Financial Services

-   **Problems:** Regulatory risk (AI Act, SR 11-7), bias in credit
    scoring, shadow AI.\
-   **JTBD:** Manage model risk, ensure fairness, document decisions.\
-   **Metrics:** Compliance audit success, reduced incidents.\
-   **Buying Committee:** CRO, CIO, Head of Model Risk, Compliance.

### Healthcare

-   **Problems:** Patient safety, FDA/EMA compliance, bias in
    diagnostics.\
-   **JTBD:** Validate AI safety, track outcomes, support audits.\
-   **Metrics:** Regulatory approval, error reduction.\
-   **Buying Committee:** CMO, CIO, Compliance, Clinical leads.

### Public Sector

-   **Problems:** Transparency, algorithmic accountability, FOIA.\
-   **JTBD:** Provide auditability, publish transparency reports.\
-   **Metrics:** Citizen trust, compliance.\
-   **Buying Committee:** CDO, CIO, Legal.

### Industrial (Energy/Manufacturing)

-   **Problems:** Safety-critical AI, predictive maintenance errors.\
-   **JTBD:** Monitor AI reliability, document compliance.\
-   **Metrics:** Fewer safety incidents.\
-   **Buying Committee:** COO, CTO, Risk, Safety Officers.

------------------------------------------------------------------------

## Key Workflows

### General AI Workflow

1.  Policy creation\
2.  Use-case intake & risk classification\
3.  Assessments (legal, compliance, ethical)\
4.  Testing & validation\
5.  Approvals & human-in-loop sign-off\
6.  Deployment\
7.  Monitoring & incident handling\
8.  Reporting & attestations

### LLM-Specific Workflow

1.  Prompt/dataset change intake\
2.  Evaluation gates configured\
3.  Red-team review & sign-off\
4.  Guardrails applied (toxicity, jailbreak filters)\
5.  Deployment\
6.  Monitoring (hallucination, safety metrics)\
7.  Incident reporting & response

------------------------------------------------------------------------

## Gap-to-MVP Plan (EU AI Act--First)

-   **MVP (90 days):** Intake & registry, policy packs, risk
    classification, prompt/dataset review, LLM eval harness, approvals,
    audit log, guardrails, incident register.\
-   **v2+:** Classical ML support, NIST/ISO packs, advanced GRC/DevOps
    integrations, red-teaming module, continuous monitoring, automated
    reporting.

**Why now:** EU AI Act deadlines, regulatory pressure, rising GenAI use
in Fortune-1000.\
**Wedge:** EU-first compliance; expand to broader governance.\
**Moat:** GenAI prompt/output governance + integrated workflows
competitors lack.

------------------------------------------------------------------------

## MVP Roadmap Table

  --------------------------------------------------------------------------------------------
  Stage       Phase       Feature          Opportunity          Why Build          For Whom
  ----------- ----------- ---------------- -------------------- ------------------ -----------
  0           Week 0--2   Intake +         Competitors lack     Prevent shadow AI  PM, Risk
                          registry         triage                                  

  0           Week 0--2   EU AI Act policy Prescriptive         OOB compliance     Risk, Legal
                          pack             controls                                

  0           Week 0--2   RBAC + SSO       Enterprise must-have Secure access      IT,
                                                                                   Security

  1           Week 1--4   Risk             Gap in auto-tagging  Route high-risk    Risk
                          classification                                           
                          engine                                                   

  1           Week 1--4   Prompt           GenAI runtime gap    Version prompts    PM, DS/ML
                          governance                                               

  1           Week 1--4   Dataset          Data duty gap        Prove data quality DS/ML, Risk
                          governance                                               

  1           Week 1--4   LLM eval harness Needed for GPAI      Block unsafe       DS/ML, Risk
                                           safety               deploy             

  1           Week 1--4   Approval gate    Oversight duty       Enforce HITL       Legal, Risk

  1           Week 1--4   Audit log        Traceability gap     Audit-ready        Audit, Risk

  2           Week 5--8   Guardrails       Runtime enforcement  Block unsafe       DS/ML, Sec
                          middleware       gap                  outputs            

  2           Week 5--8   Red-team         Adversarial testing  Institutionalize   Risk, Sec
                          workflow         gap                  tests              

  2           Week 5--8   Tech doc         Docs heavy           Auto "EU Tech      Legal,
                          generator                             File"              Audit

  2           Week 5--8   CI/CD hooks      Governance-as-code   Embed in pipeline  DS/ML,
                                                                                   DevOps

  2           Week 5--8   ServiceNow       GRC integration gap  Work where users   PMO, Risk
                          connector                             are                

  3           Week 9--12  Incident         Post-market duty     Log/report         Risk,
                          register                              incidents          Support

  3           Week 9--12  Monitoring +     Ongoing risk gap     Catch issues early DS/ML, Risk
                          drift alerts                                             

  3           Week 9--12  Disclosure       Transparency duty    Generate notices   Legal, PM
                          templates                                                

  3           Week 9--12  Exec dashboard   Oversight gap        Risk/compliance    Exec, Risk
                                                                view               

  3           Week 9--12  Attestation      Audit time sink      One-click reports  Legal,
                          exports                                                  Audit
  --------------------------------------------------------------------------------------------

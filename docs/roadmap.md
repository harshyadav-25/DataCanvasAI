# DataCanvasAI Roadmap

## 1. Roadmap Philosophy

DataCanvasAI is being developed incrementally.

The engineering sequence is:

```text
Design
   ↓
Implement
   ↓
Unit Test
   ↓
Integrate
   ↓
Integration Test
   ↓
Commit
   ↓
Push
```

The project should build the deterministic backend intelligence before the frontend and LLM layers.

---

# 2. Current Status

```text
Phase 1 — Foundation
        ✅ COMPLETE

Phase 2 — Dataset Upload & Validation
        ✅ COMPLETE

Phase 2.5 — Engineering Hardening
        ✅ 2.5.1 Upload Security
        ✅ 2.5.2 HTTP Error Handling
        ✅ 2.5.3 Standard Error Architecture
        ✅ 2.5.4 Edge-Case Audit

Phase 2.5.5 — Dataset Lifecycle
        ⏳ NEXT

Phase 2.5.6 — Original Data Immutability
        ⏳ PLANNED

Phase 2.5.7 — API Organization
        ⏳ PLANNED

Phase 2.5.8 — Configuration
        ⏳ PLANNED

Phase 2.5.9 — Logging / Observability
        ⏳ PLANNED

Phase 2.5.10 — Test Organization
        ⏳ PLANNED

Phase 3 — Dataset Profiling
        ⏳ AFTER HARDENING

Phase 4 — ML Risk Engine
        ⏳ FUTURE

Phase 5 — Recommendation / Decision Engine
        ⏳ FUTURE

Phase 6 — What-If Simulation & Validation
        ⏳ FUTURE

Phase 7 — Readiness / Pipeline / Reporting
        ⏳ FUTURE

Phase 8 — Frontend / Dashboard
        ⏳ FUTURE

Phase 9 — AI Mentor / Polish / Deployment
        ⏳ FUTURE

---

# 3. Phase 1 — Foundation

**Status: COMPLETED**

Completed:

- Git repository initialization
- project structure
- README
- Python virtual environment
- dependency setup
- FastAPI application
- root endpoint
- Swagger verification

---

# 4. Phase 2 — Dataset Upload & Validation

**Status: COMPLETED**

### Goal

```text
CSV/XLSX
   ↓
File validation
   ↓
Loader
   ↓
DataFrame
   ↓
Validator
   ↓
Upload response
```

### Completed

- CSV loading
- XLSX loading
- unsupported-format detection
- empty-file handling
- dataset structural validation
- Pydantic upload response
- `/upload` endpoint
- loader tests
- validator tests
- ingestion integration test
- upload API tests

Supported:

```text
CSV   ✅
XLSX  ✅
XLS   ❌
JSON  ❌
Parquet ❌
```

---

# 5. Phase 2.5 — Engineering Hardening

## 2.5.1 Upload Security

**Status: COMPLETED**

Implemented:

- 25 MB upload limit
- supported-extension restriction
- zero-byte upload handling
- original CSV header duplicate detection

---

## 2.5.2 HTTP Error Handling

**Status: COMPLETED**

Known failures now map to meaningful HTTP status codes:

```text
413 → file too large
415 → unsupported file format
400 → invalid/empty/read/validation failure
```

---

## 2.5.3 Standard Error Architecture

**Status: COMPLETED**

Implemented:

```text
app/exceptions/dataset.py
app/schemas/error.py
global FastAPI exception handlers
```

Current error codes:

```text
DATASET_TOO_LARGE
UNSUPPORTED_FILE_TYPE
EMPTY_DATASET
DATASET_READ_ERROR
DATASET_VALIDATION_ERROR
```

Standard structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "..."
  }
}
```

### Current verification

```text
12 tests
12 passed
```

---
# 6. Phase 2.5.4 — Edge-Case Audit

**Status: COMPLETED**

## Goal

> Verify that the ingestion boundary behaves predictably under realistic and malformed inputs.

## Completed Audit

```text
Upload
├── valid CSV                         ✅
├── valid XLSX                        ✅
├── oversized file                    ✅
├── unsupported extension             ✅
├── zero-byte file                    ✅
├── malformed CSV                     ✅
├── duplicate CSV headers             ✅
├── duplicate DataFrame columns       ✅
├── zero-row dataset                  ✅
├── zero-column dataset               ✅
├── malformed XLSX                    ✅
├── unusual filenames                 ✅
└── UTF-8 data                        ✅

---

# 7. Phase 2.5.5 — Dataset Lifecycle

**Status: PLANNED**

Before the system grows into profiling/risk/experimentation, define how a dataset is represented across the workflow.

Target concept:

```text
Upload
  ↓
dataset_id
  ↓
Profile
  ↓
Risks
  ↓
Recommendations
  ↓
Experiments
  ↓
Readiness
  ↓
Report
```

The dataset identity should eventually allow later APIs to refer to the same dataset without re-uploading it.

Do not introduce a database prematurely.

First define the lifecycle and contract.

---

# 8. Phase 2.5.6 — Original Data Immutability

**Status: PLANNED**

Architectural rule:

> The original uploaded dataset must remain unchanged.

Future operations should use copies or derived representations:

```text
Original Dataset
      |
      +--> Profiling representation
      |
      +--> Simulation copy
      |
      +--> Experiment copy
      |
      +--> Final pipeline representation
```

This is especially important for what-if experiments.

---

# 9. Phase 2.5.7 — API Organization

**Status: PLANNED**

As the number of endpoints grows, organize FastAPI routes into routers.

Future structure:

```text
app/
├── main.py
└── api/
    ├── datasets.py
    ├── analysis.py
    ├── recommendations.py
    └── ...
```

`main.py` should eventually focus on:

- app creation
- router registration
- middleware
- exception handlers
- application configuration

Do not refactor to this structure until the project needs it.

---

# 10. Phase 2.5.8 — Configuration

**Status: PLANNED**

Move operational values into a configuration layer.

Examples:

```text
MAX_UPLOAD_SIZE
ALLOWED_EXTENSIONS
ENVIRONMENT
LOG_LEVEL
API_VERSION
```

Future location:

```text
app/core/config.py
```

This is intentionally postponed until the architecture requires multiple configurable values.

---

# 11. Phase 2.5.9 — Logging / Observability

**Status: PLANNED**

Introduce structured application logging.

Future events:

```text
INFO  dataset upload started
INFO  file validated
INFO  dataset loaded
INFO  validation completed
ERROR dataset parsing failed
```

Avoid replacing application logging with scattered `print()` statements.

---

# 12. Phase 2.5.10 — Test Organization

**Status: PLANNED**

As test volume grows, move toward:

```text
tests/
├── unit/
│   ├── test_dataset_loader.py
│   ├── test_dataset_validator.py
│   └── test_profiler.py
│
└── integration/
    ├── test_ingestion.py
    └── test_upload_api.py
```

Add reusable fixtures when they reduce duplication.

---

# 13. Phase 3 — Dataset Profiling

**Status: NEXT MAJOR DEVELOPMENT PHASE**

First task:

> Design the Dataset Profiler output contract.

Do not immediately write a large profiler.

First decide:

- which metrics are required
- why each metric belongs to profiling
- which metrics belong to ML risk analysis instead
- response structure
- deterministic calculations
- edge cases
- profiler unit-test dataset cases

Initial scope:

```text
Shape
Data Types
Missing Values
Duplicate Rows
Unique Counts
Cardinality
Descriptive Statistics
Distributions
Skewness
Correlations
Constant Features
Near-Constant Features
```

Conceptual flow:

```text
Validated DataFrame
        ↓
Dataset Profiler
        ↓
Profile Result
```

The profiler should describe the dataset.

It should not yet decide what the user should do.

---

# 14. Phase 4 — ML Risk Engine

**Status: FUTURE**

Planned signals:

- target selection
- classification vs regression
- class imbalance
- identifier-like columns
- suspicious target relationships
- potential target leakage
- temporal leakage
- prediction-time availability
- train/validation contamination
- outlier signals

Important:

> A suspicious pattern is a signal for investigation, not automatically a confirmed problem.

---

# 15. Phase 5 — Recommendation / Decision Engine

**Status: FUTURE**

Recommendations must be deterministic and testable first.

Concept:

```text
Observation
   ↓
Evidence
   ↓
Reasoning
   ↓
Recommendation
   ↓
Confidence
   ↓
Expected Impact
```

Example rule:

```text
IF:
    numerical feature
    AND missing rate is moderate
    AND skewness is high

THEN:
    consider median imputation
```

The exact thresholds and confidence calculations will be defined and tested during implementation.

The LLM must not invent the recommendation.

---

# 16. Phase 6 — What-If Simulation & Validation

**Status: FUTURE**

The simulator will:

- apply candidate treatments to a copy
- recalculate relevant metrics
- run lightweight baseline models
- compare alternatives
- store experiment history

Example structure:

```text
Current Dataset
      |
      +--> Treatment A
      |
      +--> Treatment B
      |
      +--> Treatment C
                |
                v
         Baseline Evaluation
                |
                v
        Before / After Comparison
```

Real metric values must come from actual controlled experiments.

---

# 17. Phase 7 — Readiness, Pipeline & Reports

**Status: FUTURE**

### Readiness

Proposed dimensions:

```text
Data Quality          25%
Feature Quality       20%
Target Quality        15%
Leakage Risk          20%
Distribution/Balance  10%
Compatibility         10%
```

The score is diagnostic, not a guarantee of model performance.

### Pipeline

Generate reproducible preprocessing code and configuration.

### Report

Include:

- dataset summary
- findings
- risks
- recommendations
- readiness
- experiments
- final preprocessing plan

---

# 18. Phase 8 — Frontend / Dashboard

**Status: FUTURE**

Planned dashboard areas:

```text
Dataset Overview
Data Quality
Feature Health
ML Risks
Recommendations
What-If Experiments
Readiness
Pipeline
Report
```

The frontend should consume stable backend contracts rather than contain analysis logic.

Do not build the frontend before the backend analysis contracts are stable enough to support it.

---

# 19. Phase 9 — AI Mentor / Polish / Deployment

**Status: FUTURE**

AI Mentor responsibilities:

- explain computed results
- answer questions about evidence
- explain recommendations
- assist with generated code

AI safety rule:

> The LLM explains computed evidence; it does not invent statistical facts.

Later engineering work may include:

- Docker
- CI/CD
- deployment
- monitoring
- documentation polish
- demo preparation

---

# 20. Product-Level Six-Sprint Roadmap

### Sprint 1 — Research + UX

Output:

- competitor study
- wireframes
- architecture
- API contracts

### Sprint 2 — Upload + Profiling

Output:

- dataset ingestion
- core profiling metrics

### Sprint 3 — ML Risk Engine

Output:

- leakage signals
- imbalance
- identifier detection
- target analysis

### Sprint 4 — Decision Engine

Output:

- deterministic rules
- confidence
- priorities
- explanations

### Sprint 5 — What-If + Validation

Output:

- transformations
- baseline models
- comparisons

### Sprint 6 — Dashboard + Demo

Output:

- UI
- reports
- testing
- Docker
- final presentation

AI/polish can be added after the deterministic core is proven.

---

# 21. Engineering Milestone Rules

At the end of each meaningful development unit:

```text
Implement
   ↓
Run tests
   ↓
Review diff
   ↓
Commit
   ↓
Push
```

Prefer meaningful commits such as:

```text
harden dataset upload error handling
```

rather than generic messages such as:

```text
update files
```

---

# 22. Current Next Action

The immediate next development sequence is:

```text
Phase 2.5.4
   ↓
Edge-case audit
   ↓
19 tests / 19 passed
   ↓
Commit Phase 2.5.4 milestone
   ↓
Phase 2.5.5 Dataset Lifecycle
   ↓
Phase 2.5.6 Immutability
   ↓
Phase 3 Profiler Contract
   ↓
Profiler implementation
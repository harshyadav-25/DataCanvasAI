# DataCanvasAI Architecture

## 1. Architecture Goal

DataCanvasAI is designed as a modular backend system for moving from raw tabular data toward an explainable ML-readiness decision.

The architecture separates:

```text
Ingestion
   ↓
Validation
   ↓
Profiling
   ↓
ML Risk Analysis
   ↓
Recommendations
   ↓
Simulation
   ↓
Validation
   ↓
Readiness
   ↓
Pipeline / Report
   ↓
AI Explanation
```

Only the ingestion and validation foundation is implemented at the current milestone.

---

## 2. Current Implemented Architecture

```text
Client
  |
  v
FastAPI
  |
  v
POST /upload
  |
  +-----------------------------+
  |                             |
  v                             v
Upload Size Check          Dataset Loader
  |                             |
  |                             +--> Extension validation
  |                             +--> Empty-file detection
  |                             +--> CSV header integrity
  |                             +--> CSV/XLSX parsing
  |                             +--> Empty DataFrame detection
  |                             |
  |                             v
  |                        pandas.DataFrame
  |                             |
  |                             v
  |                       Dataset Validator
  |                             |
  |                             +--> rows
  |                             +--> columns
  |                             +--> duplicate columns
  |
  v
DatasetUploadResponse
  |
  v
HTTP 200
```

Known application failures travel through:

```text
Service
  ↓
Application Exception
  ↓
Global FastAPI Exception Handler
  ↓
ErrorResponse
  ↓
HTTP response
```

---

## 3. Current Backend Structure

```text
backend/
├── app/
│   ├── main.py
│   │
│   ├── exceptions/
│   │   ├── __init__.py
│   │   └── dataset.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── dataset.py
│   │   └── error.py
│   │
│   └── services/
│       ├── __init__.py
│       ├── dataset_loader.py
│       └── dataset_validator.py
│
├── test_loader.py
├── test_validator.py
├── test_ingestion.py
└── test_upload_api.py
```

Future modules are created only when their phase arrives.

---

## 4. API Layer

Current file:

```text
app/main.py
```

Responsibilities:

- receive `UploadFile`
- enforce upload size
- call the loader
- call the validator
- return the success schema
- translate application exceptions into HTTP responses

Current endpoints:

```text
GET  /
POST /upload
```

The API layer should not contain the statistical or ML logic.

---

## 5. Upload Security

Current maximum:

```text
25 MB
```

Supported file extensions:

```text
.csv
.xlsx
```

Current flow:

```text
Upload
  ↓
Read bytes
  ↓
Size check
  |
  +--> >25 MB → DatasetTooLargeError → 413
  |
  v
Dataset Loader
```

This is application-level protection. Deployment-level request limits can be added later.

---

## 6. Dataset Loader

File:

```text
app/services/dataset_loader.py
```

Responsibility:

> Convert uploaded file bytes into a Pandas DataFrame.

The loader accepts:

```text
file_content: bytes
filename: str
```

and returns:

```text
pandas.DataFrame
```

Responsibilities:

- validate extension
- detect zero-byte files
- detect original duplicate CSV headers
- parse CSV
- parse XLSX
- detect empty resulting DataFrames
- translate parsing failures into application exceptions

The loader does not know about HTTP.

---

## 7. CSV Duplicate-Header Protection

A real ingestion edge case was identified during hardening.

With Pandas 3.0.5:

```text
Name,Age,Age
```

can become:

```text
Name,Age,Age.1
```

If validation happens only after Pandas parsing, the original duplicate is hidden.

Therefore the loader checks the raw CSV header before Pandas parses the file:

```text
Raw CSV
  ↓
Read original header
  ↓
Check duplicate names
  |
  +--> duplicate → DatasetValidationError
  |
  v
Pandas parsing
  ↓
DataFrame
```

This behavior is covered by an API integration test.

---

## 8. Dataset Validator

File:

```text
app/services/dataset_validator.py
```

Responsibility:

> Determine whether the resulting DataFrame is structurally usable for the next DataCanvasAI stage.

Current checks:

- at least one row
- at least one column
- no duplicate column names

The validator does not yet perform:

- statistical profiling
- outlier analysis
- class imbalance analysis
- leakage analysis
- recommendation generation
- readiness scoring

---

## 9. Application Exceptions

File:

```text
app/exceptions/dataset.py
```

Current exceptions:

```text
UnsupportedFileTypeError
EmptyDatasetError
DatasetReadError
DatasetValidationError
DatasetTooLargeError
```

These are plain application exceptions.

They do **not** inherit from FastAPI's `HTTPException`.

Reason:

```text
Service layer
    ↓
should describe what happened

API layer
    ↓
should decide how that becomes HTTP
```

This keeps services reusable and testable.

---

## 10. Error Response Contract

File:

```text
app/schemas/error.py
```

Current structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable explanation"
  }
}
```

The `code` is intended for programmatic use.

The `message` is intended for people.

Current mapping:

| Exception | HTTP | Code |
|---|---:|---|
| DatasetTooLargeError | 413 | DATASET_TOO_LARGE |
| UnsupportedFileTypeError | 415 | UNSUPPORTED_FILE_TYPE |
| EmptyDatasetError | 400 | EMPTY_DATASET |
| DatasetReadError | 400 | DATASET_READ_ERROR |
| DatasetValidationError | 400 | DATASET_VALIDATION_ERROR |

---

## 11. Global Exception Handling

FastAPI global exception handlers are registered in `main.py`.

Conceptually:

```text
UnsupportedFileTypeError
        ↓
415
UNSUPPORTED_FILE_TYPE
```

```text
EmptyDatasetError
        ↓
400
EMPTY_DATASET
```

```text
DatasetReadError
        ↓
400
DATASET_READ_ERROR
```

```text
DatasetValidationError
        ↓
400
DATASET_VALIDATION_ERROR
```

```text
DatasetTooLargeError
        ↓
413
DATASET_TOO_LARGE
```

This avoids endpoint-specific error-handling duplication.

---

## 12. Success Contract

File:

```text
app/schemas/dataset.py
```

Current success response:

```text
DatasetUploadResponse
├── filename
├── file_type
├── rows
├── columns
├── column_names
└── message
```

The upload endpoint intentionally does not return profiler, risk, recommendation, or readiness data yet.

---

## 13. Test Architecture

Current test modules:

```text
test_loader.py
test_validator.py
test_ingestion.py
test_upload_api.py
```

Current verified total:

```text
12 tests
12 passed
```

Tests cover:

```text
Loader
├── valid CSV
├── unsupported format
├── empty dataset
├── malformed dataset
└── duplicate CSV headers

Validator
├── valid dataset
└── duplicate columns

Ingestion
└── loader + validator

Upload API
├── valid CSV
├── oversized file
├── unsupported format
├── duplicate columns
├── empty dataset
└── malformed CSV
```

---

## 14. Architecture Principles

### Separation of concerns

Each component owns one responsibility.

### Deterministic first

Core analysis should be deterministic and testable.

### Evidence before explanation

Future recommendations and AI explanations should be based on measured evidence.

### Original data protection

The original uploaded dataset should remain unchanged.

Future simulation and experimentation should work on copies or derived representations.

### Incremental architecture

Do not create every planned module at once.

### Test before expansion

New behavior should have regression coverage before becoming part of the stable backend.

---

## 15. Planned Architecture

```text
                    FastAPI
                       |
                       v
                 Dataset Service
                       |
             +---------+---------+
             |                   |
             v                   v
          Loader             Validator
             |                   |
             +---------+---------+
                       |
                       v
                    Profiler
                       |
                       v
                 ML Risk Engine
                       |
                       v
             Recommendation Engine
                       |
                       v
                What-If Simulator
                       |
                       v
               Validation Engine
                       |
                       v
                Readiness Engine
                       |
              +--------+--------+
              |                 |
              v                 v
        Pipeline Generator   Report
              |
              v
          AI Mentor
```

Only the loader, validator, and upload/API error foundation are currently implemented.

---

## 16. Phase 3 Target — Dataset Profiler

The profiler should answer:

> What does this dataset contain statistically?

Initial scope:

- rows / columns
- data types
- missing values
- duplicate rows
- unique counts
- descriptive statistics
- distributions
- correlations
- skewness
- cardinality
- constant features
- near-constant features

The profiler should not make ML recommendations.

---

## 17. Future API Architecture

The PRD proposes:

```text
POST /api/v1/datasets
GET  /api/v1/datasets/{id}/summary
GET  /api/v1/datasets/{id}/profile
GET  /api/v1/datasets/{id}/risks
GET  /api/v1/datasets/{id}/recommendations
POST /api/v1/datasets/{id}/simulate
GET  /api/v1/datasets/{id}/experiments
GET  /api/v1/datasets/{id}/readiness
POST /api/v1/datasets/{id}/mentor
GET  /api/v1/datasets/{id}/pipeline
GET  /api/v1/datasets/{id}/report
```

Current endpoint remains:

```text
POST /upload
```

Do not prematurely migrate to the future API layout.

---

## 18. Future Product Flow

```text
Raw Dataset
    ↓
Upload
    ↓
Validation
    ↓
Profiling
    ↓
ML Risk Analysis
    ↓
Prioritization
    ↓
Recommendation
    ↓
What-If Experiment
    ↓
Baseline Validation
    ↓
Readiness Score
    ↓
Reproducible Pipeline
    ↓
Report / AI Explanation
```

This is the product architecture, not a claim that every stage is implemented today.

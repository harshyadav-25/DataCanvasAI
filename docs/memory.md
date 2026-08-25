# DataCanvasAI â€” Memory / Handoff

## 1. Project Identity

**Project:** DataCanvasAI
**Working title:** DataCanvasAI
**Tagline:** From Raw Dataset to ML-Ready Dataset
**Project type:** AI/ML Mini Project
**Team size:** 6 members

DataCanvasAI is an explainable ML readiness and dataset decision platform. It is **not just a dataset profiler**.

Core product idea:

> Evidence â†’ Decision â†’ Experiment â†’ Validation â†’ Reproducible Pipeline

The long-term product helps a user move from:

> "I found a problem in my dataset â€” what should I do now?"

to an evidence-backed recommendation, controlled experiment, validation result, and reproducible preprocessing workflow.

---

## 2. Product Direction / USP

The PRD v2.0 and Easy Complete Project Guide remain the source of truth for product direction.

### Long-term workflow

```text
Dataset
   â†“
Upload / Ingestion
   â†“
Schema Understanding
   â†“
Dataset Profiling
   â†“
ML Risk Analysis
   â†“
Issue Prioritization
   â†“
Deterministic Recommendations
   â†“
What-If Simulation
   â†“
Baseline Validation
   â†“
ML Readiness Score
   â†“
Pipeline / Report
   â†“
AI Mentor Explanation
```

### Core differentiation

Do **not** claim that DataCanvasAI invented:

- dataset profiling
- missing-value detection
- duplicate detection
- outlier detection
- leakage detection
- preprocessing
- code generation

Existing tools already provide many of these capabilities.

The differentiator is their integration into an explainable, decision-first ML workflow:

```text
Evidence
   â†“
Decision
   â†“
Experiment
   â†“
Validation
   â†“
Reproducible Pipeline
```

Strong product statement:

> DataCanvasAI connects dataset evidence to an explainable ML recommendation, lets the user test alternatives, validates the impact, and generates a reproducible preprocessing workflow.

---

## 3. Development Philosophy

Build the **brain before the body**.

Do not rush into React or the LLM.

Development pattern:

```text
Design
   â†“
Implement
   â†“
Unit Test
   â†“
Integrate
   â†“
Integration Test
   â†“
Commit
   â†“
Push to GitHub
```

Principles:

- Work step-by-step.
- One small task at a time.
- Explain WHY before code/commands.
- Explain architecture, not only code.
- Test independent modules before integration.
- Update this memory after meaningful milestones.
- Keep GitHub synchronized with meaningful commits.
- Prepare for faculty/viva questions.
- Keep the project technically differentiated.
- Do not rush into frontend/LLM before backend intelligence is proven.

Core principle:

> **Don't just make it work. Understand why it works.**

---

## 4. Team Structure

There are 6 team members:

1. Frontend
2. Backend
3. Data Profiling
4. ML / Risk
5. Recommendation / AI
6. QA / DevOps / Product

Everyone should understand the complete end-to-end flow because faculty may ask any member about modules outside their assigned responsibility.

---

## 5. Readiness Score

Current proposed dimensions:

| Dimension | Weight |
|---|---:|
| Data Quality | 25% |
| Feature Quality | 20% |
| Target Quality | 15% |
| Leakage Risk | 20% |
| Distribution & Balance | 10% |
| Model Compatibility | 10% |
| **Total** | **100%** |

The readiness score is a **diagnostic indicator**, not a guarantee of model performance.

Every dimension should eventually expose the factors that influenced its score.

---

# 6. Current Development Status

## Phase 1 â€” Foundation

**Status: COMPLETED**

Completed:

- Git repository initialized.
- Initial project setup committed.
- README renamed appropriately.
- FastAPI backend foundation created.
- FastAPI server verified.
- Swagger verified.

Known completed commits from the earlier project history:

```text
96dc5b5 Initial project setup
3565586 Rename Readme.md to README.md
2bba02c Set up FastAPI backend foundation
```

---

## Phase 2 â€” Dataset Upload & Validation

**Status: COMPLETED**

Goal:

```text
CSV/XLSX
   â†“
File validation
   â†“
Dataset loader
   â†“
DataFrame
   â†“
Dataset validator
   â†“
Basic dataset information
```

Supported MVP formats:

```text
.csv   âœ…
.xlsx  âœ…
.xls   âŒ for now
.json  âŒ
.parquet âŒ
```

Completed:

- CSV loading.
- XLSX loading.
- Unsupported file-format detection.
- Empty-file handling.
- Dataset structural validation.
- Pydantic success-response contract.
- FastAPI `/upload` endpoint.
- Loader unit tests.
- Validator unit tests.
- Ingestion integration test.
- Upload API integration tests.
- Sample datasets.

---

# 7. Phase 2.5 â€” Engineering Hardening

**Status: PHASE 2.5.3 COMPLETED**

Purpose:

> Move the ingestion foundation from "it works" toward a more production-style backend foundation with security checks, explicit application errors, predictable HTTP behavior, and regression tests.

---

## 7.1 Phase 2.5.1 â€” Upload Security

**Status: COMPLETED**

Implemented:

### Maximum upload size

```text
25 MB
```

Files above the limit are rejected.

### Supported formats

```text
.csv
.xlsx
```

### Empty upload protection

Zero-byte uploads are explicitly rejected.

### CSV header integrity

CSV headers are inspected before Pandas parses them so original duplicate headers are not silently hidden by Pandas' column-name normalization.

Example:

```text
Name,Age,Age
```

must remain detectable as:

```text
Duplicate column names found: ['Age']
```

instead of becoming:

```text
Name,Age,Age.1
```

---

## 7.2 Phase 2.5.2 â€” HTTP Error Handling

**Status: COMPLETED**

Invalid client input is no longer allowed to appear as a generic server error when a known application error exists.

Current mapping includes:

```text
Unsupported file format â†’ 415
Empty / invalid dataset â†’ 400
Dataset read failure â†’ 400
Dataset validation failure â†’ 400
File too large â†’ 413
```

---

## 7.3 Phase 2.5.3 â€” Standard Error Architecture

**Status: COMPLETED**

Created:

```text
backend/app/exceptions/
â”œâ”€â”€ __init__.py
â””â”€â”€ dataset.py
```

Application exceptions:

```text
UnsupportedFileTypeError
EmptyDatasetError
DatasetReadError
DatasetValidationError
DatasetTooLargeError
```

Created:

```text
backend/app/schemas/error.py
```

Standard response shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable explanation"
  }
}
```

Global FastAPI exception handlers translate application exceptions into HTTP responses.

### Current mapping

| Exception | HTTP | API code |
|---|---:|---|
| `DatasetTooLargeError` | 413 | `DATASET_TOO_LARGE` |
| `UnsupportedFileTypeError` | 415 | `UNSUPPORTED_FILE_TYPE` |
| `EmptyDatasetError` | 400 | `EMPTY_DATASET` |
| `DatasetReadError` | 400 | `DATASET_READ_ERROR` |
| `DatasetValidationError` | 400 | `DATASET_VALIDATION_ERROR` |

This keeps service code independent of HTTP concepts.

---

# 8. Current Backend Structure

Current relevant structure:

```text
DataCanvasAI/
â”‚
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ main.py
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ exceptions/
â”‚   â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”‚   â””â”€â”€ dataset.py
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”‚   â”œâ”€â”€ dataset_loader.py
â”‚   â”‚   â”‚   â””â”€â”€ dataset_validator.py
â”‚   â”‚   â”‚
â”‚   â”‚   â””â”€â”€ schemas/
â”‚   â”‚       â”œâ”€â”€ __init__.py
â”‚   â”‚       â”œâ”€â”€ dataset.py
â”‚   â”‚       â””â”€â”€ error.py
â”‚   â”‚
â”‚   â”œâ”€â”€ test_loader.py
â”‚   â”œâ”€â”€ test_validator.py
â”‚   â”œâ”€â”€ test_ingestion.py
â”‚   â”œâ”€â”€ test_upload_api.py
â”‚   â”œâ”€â”€ venv/
â”‚   â””â”€â”€ requirements.txt
â”‚
â”œâ”€â”€ datasets/
â”‚   â”œâ”€â”€ sample/
â”‚   â””â”€â”€ uploads/
â”‚
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ architecture.md
â”‚   â”œâ”€â”€ memory.md
â”‚   â””â”€â”€ roadmap.md
â”‚
â”œâ”€â”€ frontend/
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

Planned modules are intentionally created only when their development phase arrives.

---

# 9. Environment

Backend virtual environment:

```text
backend/venv/
```

Activation:

```powershell
.\venv\Scripts\Activate.ps1
```

Relevant environment versions observed during development:

```text
Python 3.13.3
pytest 9.1.1
pandas 3.0.5
```

Main project dependencies include:

```text
fastapi
uvicorn
pandas
numpy
scikit-learn
matplotlib
openpyxl
python-multipart
reportlab
pytest
httpx2
```

---

# 10. FastAPI Foundation

File:

```text
backend/app/main.py
```

Current endpoints:

```text
GET  /
POST /upload
```

Root response:

```json
{
  "message": "DataCanvasAI Backend is running!"
}
```

Run:

```powershell
uvicorn app.main:app --reload
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 11. Dataset Loader

File:

```text
backend/app/services/dataset_loader.py
```

Responsibility:

> Can I turn this uploaded file into a DataFrame?

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

- extension validation
- zero-byte detection
- CSV parsing
- XLSX parsing
- original CSV header duplicate detection
- empty DataFrame detection
- conversion of parsing failures to application exceptions

The loader does **not** generate HTTP responses.

---

# 12. Dataset Validator

File:

```text
backend/app/services/dataset_validator.py
```

Responsibility:

> Is this DataFrame structurally usable for further DataCanvasAI processing?

Current checks:

1. DataFrame contains rows.
2. DataFrame contains columns.
3. Column names are not duplicated.

The validator does not yet handle:

- statistical profiling
- outliers
- imbalance
- leakage
- recommendations
- readiness score

Those belong to later modules.

---

# 13. Pydantic Dataset API Contract

File:

```text
backend/app/schemas/dataset.py
```

Current success model:

```text
DatasetUploadResponse
â”œâ”€â”€ filename: str
â”œâ”€â”€ file_type: str
â”œâ”€â”€ rows: int
â”œâ”€â”€ columns: int
â”œâ”€â”€ column_names: list[str]
â””â”€â”€ message: str
```

Example:

```json
{
  "filename": "test_dataset.csv",
  "file_type": "csv",
  "rows": 5,
  "columns": 4,
  "column_names": [
    "Name",
    "Age",
    "Salary",
    "City"
  ],
  "message": "Dataset uploaded and validated successfully."
}
```

The upload endpoint does not yet return profiling, risk, recommendation, or readiness data.

---

# 14. Standard Error Contract

File:

```text
backend/app/schemas/error.py
```

Current model:

```text
ErrorResponse
â””â”€â”€ error
    â”œâ”€â”€ code
    â””â”€â”€ message
```

Example:

```json
{
  "error": {
    "code": "UNSUPPORTED_FILE_TYPE",
    "message": "Unsupported file format: .pdf. Supported formats are CSV and XLSX."
  }
}
```

The error code is machine-readable. The message is human-readable.

---

# 15. Upload API Flow

Current flow:

```text
POST /upload
      â†“
FastAPI receives UploadFile
      â†“
read file bytes
      â†“
size check
      â†“
load_dataset()
      â†“
DataFrame
      â†“
validate_dataset()
      â†“
DatasetUploadResponse
      â†“
HTTP 200
```

Known failures are routed through global exception handlers.

---

# 16. Test Suite

The backend uses pytest.

Test files:

```text
test_loader.py
test_validator.py
test_ingestion.py
test_upload_api.py
```

Current verified test count:

```text
12 tests
12 passed
```

The tests cover:

### Loader

- valid CSV
- unsupported file format
- empty dataset
- malformed/unreadable dataset
- duplicate CSV headers

### Validator

- valid dataset
- duplicate column names

### Ingestion

- loader â†’ DataFrame â†’ validator

### Upload API

- valid CSV
- oversized file
- unsupported file type
- duplicate columns
- empty dataset
- malformed CSV

The latest known verification is:

```text
12 passed
```

---

# 17. Important Engineering Lessons Captured

### Pandas duplicate-header behavior

Pandas 3.0.5 can normalize duplicate CSV headers:

```text
Name,Age,Age
```

into:

```text
Name,Age,Age.1
```

Therefore duplicate-header detection must happen before Pandas parses the CSV.

This is now protected by an API integration test.

### Service/API separation

Services raise application-specific exceptions.

FastAPI handlers translate those exceptions into HTTP responses.

This prevents the data-processing layer from depending on FastAPI.

---

# 18. Current Architecture Responsibility Map

### Dataset Loader

> Can I turn this file into a DataFrame?

### Dataset Validator

> Is this DataFrame structurally usable?

### Dataset Profiler

> What does this dataset contain statistically?

### ML Risk Engine

> What could go wrong if this dataset is used for ML?

### Recommendation Engine

> Given the evidence, what should the user consider doing?

### Simulation / Validation

> Does the proposed intervention actually help in a controlled experiment?

### Readiness Engine

> What is the overall diagnostic readiness score?

### AI Mentor

> Explain the computed evidence and recommendations in natural language.

---

# 19. Next Phase â€” Phase 3 Dataset Profiling

**Status: NEXT**

Do not start React or the LLM yet.

First task:

> Design the Dataset Profiler output contract before implementing the profiler.

The profiler should answer:

> **What does this dataset contain statistically?**

It should not make ML recommendations.

Initial profiling scope from the PRD:

- rows / columns
- data types
- missing values
- duplicates
- unique counts
- descriptive statistics
- distributions
- correlations
- skewness
- cardinality
- constant features
- near-constant features

Recommended conceptual flow:

```text
Validated DataFrame
        â†“
Dataset Profiler
        â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Shape                    â”‚
â”‚ Data Types               â”‚
â”‚ Missing Values           â”‚
â”‚ Duplicate Rows           â”‚
â”‚ Unique Values            â”‚
â”‚ Cardinality              â”‚
â”‚ Numeric Statistics       â”‚
â”‚ Distributions            â”‚
â”‚ Skewness                 â”‚
â”‚ Correlations             â”‚
â”‚ Constant Features        â”‚
â”‚ Near-Constant Features   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

First design the contract, then implement one small component at a time.

---

# 20. Future Backend Architecture

Create modules only when their phase arrives:

```text
backend/
â””â”€â”€ app/
    â”œâ”€â”€ main.py
    â”œâ”€â”€ api/
    â”œâ”€â”€ exceptions/
    â”œâ”€â”€ services/
    â”‚   â”œâ”€â”€ dataset_loader.py
    â”‚   â”œâ”€â”€ dataset_validator.py
    â”‚   â”œâ”€â”€ profiler.py
    â”‚   â”œâ”€â”€ risk_engine.py
    â”‚   â”œâ”€â”€ recommendation_engine.py
    â”‚   â”œâ”€â”€ simulation_engine.py
    â”‚   â”œâ”€â”€ validation_engine.py
    â”‚   â”œâ”€â”€ readiness_engine.py
    â”‚   â””â”€â”€ report_generator.py
    â”œâ”€â”€ schemas/
    â”‚   â”œâ”€â”€ dataset.py
    â”‚   â”œâ”€â”€ error.py
    â”‚   â”œâ”€â”€ analysis.py
    â”‚   â”œâ”€â”€ recommendation.py
    â”‚   â””â”€â”€ readiness.py
    â”œâ”€â”€ core/
    â”‚   â””â”€â”€ config.py
    â””â”€â”€ utils/
```

Do not create all planned modules at once.

---

# 21. Planned API Roadmap

The PRD proposes the eventual API structure:

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

Current MVP endpoint remains:

```text
POST /upload
```

Do not prematurely refactor to `/api/v1/datasets` until that API organization phase is deliberately implemented.

---

# 22. Product Modules â€” Future

## ML Risk Engine

Will later inspect:

- target selection
- classification vs regression
- class imbalance
- identifier-like columns
- suspicious target relationships
- potential target leakage
- temporal leakage signals
- prediction-time availability
- train/validation contamination
- outlier signals

Signals should be presented as investigation candidates, not guaranteed errors.

## Recommendation Engine

Must be deterministic and testable first.

Concept:

```text
Observation
   â†“
Evidence
   â†“
Reasoning
   â†“
Recommendation
   â†“
Confidence
   â†“
Expected Impact
```

The LLM should not invent analytical recommendations.

## What-If Simulator

Future capabilities:

- apply candidate transformations to a copy
- recalculate important metrics
- run lightweight baseline models
- compare validation metrics
- store experiment history

## AI Mentor

Future AI layer.

The LLM explains computed evidence and recommendations; it should not invent statistics or override deterministic analysis.

## Reproducible Pipeline

Future output may include:

- Python/Pandas preprocessing code
- Scikit-learn Pipeline where appropriate
- transformation sequence
- configuration/metadata
- validation checks

## Report Generator

Future report:

- dataset summary
- key findings
- risk matrix
- recommendations
- readiness score
- experiments
- final preprocessing plan

---

# 23. Six-Sprint Roadmap

### Sprint 1 â€” Research + UX

- competitor study
- wireframes
- architecture
- API contracts

### Sprint 2 â€” Upload + Profiling

- dataset ingestion
- core profiling metrics

### Sprint 3 â€” ML Risk Engine

- leakage signals
- imbalance
- identifier detection
- target analysis

### Sprint 4 â€” Decision Engine

- deterministic rules
- confidence
- priorities
- explanations

### Sprint 5 â€” What-If + Validation

- transformations
- baseline models
- comparisons

### Sprint 6 â€” Dashboard + Demo

- UI
- reports
- testing
- Docker
- final presentation

AI/polish can be added after the deterministic core is proven.

---

# 24. Git Milestone Guidance

After a meaningful phase is fully tested:

```powershell
git status
git diff
git add <intended-files>
git commit -m "<meaningful milestone>"
git push
```

Do not blindly commit unrelated changes.

Current Phase 2.5.3 changes should be treated as one coherent engineering-hardening milestone once the final working tree has been reviewed.

---

# 25. Immediate Continuation Prompt

Use this when switching chats:

> Continue DataCanvasAI from `docs/memory.md`.
>
> Phase 1 and Phase 2 are complete.
>
> Phase 2.5 Engineering Hardening through 2.5.3 is complete and verified with 12 passing tests.
>
> The current backend includes upload-size protection, application-specific dataset exceptions, a standard ErrorResponse contract, global FastAPI exception handlers, CSV duplicate-header protection, and upload edge-case tests.
>
> Do not restart the project. Do not jump to React or the LLM.
>
> Next is Phase 2.5.4: edge-case audit, followed by dataset lifecycle/immutability and the remaining engineering-hardening work.
>
> Only after the hardening milestone is complete should Phase 3 Dataset Profiling begin.
>
> Follow:
>
> Design â†’ Implement â†’ Unit Test â†’ Integrate â†’ Integration Test â†’ Commit â†’ Push.

---

# 26. Viva Notes

### What is unique?

Do not say:

> We invented profiling.

Say:

> Existing tools already provide profiling and many individual data-quality capabilities. Our difference is the decision loop: DataCanvasAI connects evidence to an explainable recommendation, allows what-if testing, validates the effect with a baseline model, and generates a reproducible pipeline.

### Why not YData?

> YData is excellent for profiling. DataCanvasAI is designed for the next step: deciding what to do with those findings for an ML task.

### Why not SageMaker Data Wrangler?

> SageMaker already has many advanced capabilities. DataCanvasAI is proposed as a focused, lightweight, educational and explainable workflow centered on the ML-readiness decision rather than as an enterprise cloud data-preparation suite.

### Can AI make mistakes?

> Yes. That is why the core analysis and recommendation engine should be deterministic and testable. The LLM should explain computed evidence rather than invent it.

---

# 27. Final Project Statement

> **DataCanvasAI helps users move from a raw dataset to a more ML-ready dataset by finding important issues, explaining recommended actions, testing alternatives, validating their impact, and generating a reproducible preprocessing workflow.**

Core USP:

```text
Evidence
   â†“
Decision
   â†“
Experiment
   â†“
Validation
   â†“
Reproducible ML Pipeline
```

<div align="center">

# DataCanvasAI

### From Raw Data to ML-Ready Decisions

**An explainable dataset analysis and machine-learning readiness platform.**

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Pandas](https://img.shields.io/badge/Data-Pandas-150458?logo=pandas&logoColor=white)](https://pandas.pydata.org/)
[![NumPy](https://img.shields.io/badge/Numerical-NumPy-013243?logo=numpy&logoColor=white)](https://numpy.org/)
[![Scikit-learn](https://img.shields.io/badge/ML-Scikit--learn-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Tests](https://img.shields.io/badge/Testing-Pytest-0A9EDC?logo=pytest&logoColor=white)](https://pytest.org/)

[Repository](https://github.com/harshyadav-25/DataCanvasAI) · [Report a Bug](https://github.com/harshyadav-25/DataCanvasAI/issues) · [Request a Feature](https://github.com/harshyadav-25/DataCanvasAI/issues)

</div>

---

## Overview

Preparing a dataset for machine learning involves more than loading a file. Missing values, duplicate records, inconsistent schemas, class imbalance, identifier-like features, and potential target leakage can affect the reliability of downstream experiments.

**DataCanvasAI** is designed to bring dataset inspection, machine-learning risk analysis, explainable recommendations, preprocessing, and model evaluation into one workflow. It aims to help users move from *seeing a data issue* to *understanding a possible action and evaluating its effect*.

The project's core idea is a decision-oriented workflow:

> **Evidence → Risk Analysis → Recommendation → Experiment → Validation**

DataCanvasAI does not assume that every warning is an error or that a preprocessing change will always improve a model. Findings should be interpreted in the context of the dataset, target, task, and evaluation design.

## The Problem

Data preparation often involves multiple disconnected steps and tools:

- Inspecting structure, types, distributions, and missingness.
- Finding duplicate records and inconsistent columns.
- Investigating ML-specific risks such as class imbalance or potential leakage.
- Deciding which preprocessing operation is appropriate.
- Comparing model results before and after a change.
- Keeping analysis decisions understandable and reproducible.

DataCanvasAI aims to connect these activities in a single, explainable workflow rather than leaving every next step to manual interpretation.

## Product Goals

- Make dataset quality signals easier to inspect.
- Surface ML-specific risks alongside general data-quality findings.
- Provide recommendations grounded in detected evidence.
- Support controlled preprocessing and model-evaluation workflows.
- Help users understand the trade-offs behind candidate data-preparation decisions.
- Encourage reproducibility through structured analysis and reporting.

## Capabilities

The following describes the project's intended product workflow. Availability can vary by the current repository implementation.

| Capability | Purpose |
|---|---|
| CSV/XLSX ingestion | Load supported tabular datasets and reject unsupported or invalid inputs. |
| Dataset validation | Check whether uploaded data is usable and structurally valid. |
| Dataset profiling | Summarize rows, columns, types, statistics, and data-quality signals. |
| Data-quality analysis | Investigate missing values, duplicates, outliers, and related issues. |
| ML risk analysis | Surface signals such as class imbalance, identifier-like columns, and potential leakage. |
| Explainable recommendations | Translate findings into proposed data-preparation actions with reasons. |
| Preprocessing workflow | Prepare candidate datasets for downstream evaluation. |
| Model evaluation | Train and compare candidate models using suitable task-specific metrics. |
| Reports | Consolidate relevant analysis findings and evaluation results for review. |
| Automated tests | Verify service behavior, validation logic, error handling, and edge cases. |

**Interpretation note:** Outliers, correlations, identifier-like columns, and leakage signals require context. A detected signal is not, by itself, proof that a feature is invalid or that a model is leaking target information.

## What Makes the Workflow Different?

DataCanvasAI's goal is not to claim that dataset profiling or preprocessing is new. Its focus is the connection between analysis and the next decision.

```text
             ┌────────────────────┐
             │   Upload Dataset   │
             └─────────┬──────────┘
                       ▼
             ┌────────────────────┐
             │ Validate & Profile │
             └─────────┬──────────┘
                       ▼
             ┌────────────────────┐
             │ Analyze ML Risks   │
             └─────────┬──────────┘
                       ▼
             ┌────────────────────┐
             │ Explain Findings   │
             └─────────┬──────────┘
                       ▼
             ┌────────────────────┐
             │ Recommend Actions  │
             └─────────┬──────────┘
                       ▼
             ┌────────────────────┐
             │ Prepare & Evaluate │
             └─────────┬──────────┘
                       ▼
             ┌────────────────────┐
             │ Review Results     │
             └────────────────────┘
```

A recommendation should be treated as a hypothesis to evaluate—not a guarantee of improved performance. Reliable comparisons require appropriate splits, metrics, and leakage-safe preprocessing.

## Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Backend API | Python, FastAPI, Uvicorn | API routing and request handling |
| Data processing | Pandas, NumPy | Tabular data operations and numerical analysis |
| Machine learning | Scikit-learn | ML utilities and model evaluation workflows |
| Spreadsheet support | OpenPyXL | XLSX file handling |
| Visualization | Matplotlib | Analysis visualizations where used |
| Testing | Pytest | Automated backend tests |
| Frontend | React / Vite, where present in the repository | User interface and interaction |
| Version control | Git, GitHub | Source control and collaboration |

See the actual dependency and frontend configuration files in the repository for the definitive list of installed packages and scripts.

## Architecture

The backend is organized around a FastAPI application and modular services. This separation helps keep API handling distinct from data-processing and analysis logic.

```text
DataCanvasAI/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/          # API routes, where implemented
│   │   ├── services/     # Dataset and analysis services
│   │   ├── schemas/      # Request/response models
│   │   └── core/         # Shared configuration, where implemented
│   ├── requirements.txt
│   └── ...
├── frontend/            
└── README.md
```

This is a conceptual overview, not a guarantee that every listed directory exists in every revision. The checked-out source tree is authoritative.

### Engineering Principles

- **Modularity:** Keep analysis logic separated into focused services.
- **Validation first:** Reject unsupported or unusable input with clear errors.
- **Explicit error handling:** Return consistent, understandable API failures.
- **Evidence-based decisions:** Connect recommendations to observable dataset characteristics.
- **Testability:** Cover normal cases, invalid inputs, and edge cases.
- **Reproducibility:** Make analysis steps and evaluation assumptions reviewable.

## Getting Started

### Prerequisites

- Git
- Python version compatible with the backend dependencies
- Node.js and npm, if the frontend is included and you want to run it

### 1. Clone the repository

```bash
git clone https://github.com/harshyadav-25/DataCanvasAI.git
cd DataCanvasAI
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell**

```powershell
.\venv\Scripts\Activate.ps1
```

**Windows Command Prompt**

```cmd
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the development server from the `backend` directory:

```bash
uvicorn app.main:app --reload
```

If startup succeeds, the API is available at:

- API root: http://127.0.0.1:8000/
- Interactive API documentation: http://127.0.0.1:8000/docs
- OpenAPI schema: http://127.0.0.1:8000/openapi.json

The available endpoints depend on the current implementation.

### 3. Run the frontend (if included)

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Use the local URL printed by the development server. If the frontend requires environment variables, configure them using the repository's example environment file and setup instructions. Do not commit secrets or private credentials.

## Testing

Run tests from the backend directory with the virtual environment activated:

```bash
pytest -v
```

To run a specific test file:

```bash
pytest path/to/test_file.py -v
```

To run tests with coverage, if `pytest-cov` is installed:

```bash
pytest --cov=app --cov-report=term-missing
```

The project's test suite has been developed to exercise dataset ingestion, validation behavior, service logic, API responses, and edge cases. Test totals can change as new tests are added; run the current suite to verify the result for your checkout.

## Supported Input Formats

The documented MVP supports:

| Format | Extension |
|---|---|
| Comma-separated values | `.csv` |
| Excel workbook | `.xlsx` |

Other formats should be considered unsupported unless the current implementation explicitly adds them. Large-file limits and accepted schemas are determined by backend configuration.

## API Exploration

FastAPI's interactive documentation is available at:

`http://127.0.0.1:8000/docs`

Use it to inspect the routes registered by the running application, review request and response schemas, and test supported operations. Refer to the live OpenAPI specification rather than assuming planned endpoint names are implemented.

## Responsible Interpretation of Results

DataCanvasAI is a decision-support and experimentation tool, not a guarantee of model quality.

- A readiness indicator, if available, is diagnostic—not proof that a model will perform well.
- Potential leakage findings require investigation in the context of how features are created and used.
- Outlier detection should not automatically be interpreted as error detection.
- Model comparisons are meaningful only when evaluation methods are appropriate and comparable.
- Preprocessing must be fitted on training data only when necessary to avoid data leakage.
- Sensitive data should not be uploaded unless you are authorized to process it and understand the application's data-handling behavior.

## Roadmap

The following are potential directions for continued development. They should not be interpreted as claims that all items are already available.

- [ ] Expand benchmark datasets and test coverage.
- [ ] Improve recommendation explanations and prioritization.
- [ ] Strengthen leakage-safe preprocessing and evaluation.
- [ ] Add structured experiment history and before/after comparisons.
- [ ] Improve report clarity and reproducibility.
- [ ] Explore dataset versioning and drift monitoring.
- [ ] Explore fairness analysis and model explainability.
- [ ] Consider deployment automation and containerization.

## Contributing

Contributions and constructive feedback are welcome.

1. Fork the repository.
2. Create a focused branch: `git checkout -b feat/your-change`.
3. Make your changes and add or update tests.
4. Run the relevant test suite.
5. Commit with a clear message.
6. Open a pull request describing the change, its motivation, and how it was tested.

For bugs or feature ideas, use the repository's [GitHub Issues](https://github.com/harshyadav-25/DataCanvasAI/issues).

## Security and Data Privacy

Do not commit API keys, access tokens, passwords, private datasets, or local environment files. Before using real or sensitive data, review the application's storage, logging, retention, and deployment configuration. Report suspected security vulnerabilities privately to the maintainer rather than publishing exploit details in a public issue.

## Maintainer

**Harsh Yadav**

- GitHub profile: [@harshyadav-25](https://github.com/harshyadav-25)
- Repository: [DataCanvasAI](https://github.com/harshyadav-25/DataCanvasAI)

## License

No license is specified by this README. Until a license is added to the repository, do not assume that reuse, redistribution, or modification is permitted. Add a suitable `LICENSE` file when the project's licensing decision has been made.

---

<div align="center">

**DataCanvasAI — Make data quality visible. Make ML decisions explainable.**

</div>

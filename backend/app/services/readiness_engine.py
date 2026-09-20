import pandas as pd

from app.schemas.readiness import (
    ReadinessDimensionScores,
    ReadinessScoreResponse,
)
from app.services.dataset_risk_engine import (
    detect_class_imbalance,
    detect_identifier_like_columns,
)
from app.services.target_analyzer import analyze_target
from app.services.validation_engine import get_models

READINESS_WEIGHTS = {
    "data_quality": 0.25,
    "feature_quality": 0.20,
    "target_quality": 0.15,
    "leakage_risk": 0.20,
    "distribution_balance": 0.10,
    "model_compatibility": 0.10,
}


def calculate_readiness_score(
    dimensions: ReadinessDimensionScores,
) -> ReadinessScoreResponse:
    overall_score = (
        dimensions.data_quality * READINESS_WEIGHTS["data_quality"]
        + dimensions.feature_quality * READINESS_WEIGHTS["feature_quality"]
        + dimensions.target_quality * READINESS_WEIGHTS["target_quality"]
        + dimensions.leakage_risk * READINESS_WEIGHTS["leakage_risk"]
        + dimensions.distribution_balance
        * READINESS_WEIGHTS["distribution_balance"]
        + dimensions.model_compatibility
        * READINESS_WEIGHTS["model_compatibility"]
    )

    return ReadinessScoreResponse(
        overall_score=round(overall_score, 2),
        dimensions=dimensions,
    )

def calculate_data_quality_score(profile) -> float:
    if profile.rows <= 0 or profile.columns <= 0:
        return 0.0

    total_cells = profile.rows * profile.columns

    missing_rate = (
        profile.total_missing_values / total_cells
    )

    duplicate_rate = (
        profile.duplicate_rows / profile.rows
    )

    missing_penalty = min(missing_rate * 60, 60)
    duplicate_penalty = min(duplicate_rate * 40, 40)

    score = 100 - missing_penalty - duplicate_penalty

    return round(max(score, 0.0), 2)
def calculate_feature_quality_score(
    dataframe: pd.DataFrame,
) -> float:
    if dataframe.empty or len(dataframe.columns) == 0:
        return 0.0

    identifier_findings = detect_identifier_like_columns(dataframe)

    identifier_count = len(identifier_findings)
    feature_count = len(dataframe.columns)

    identifier_rate = identifier_count / feature_count

    penalty = min(identifier_rate * 100, 100)

    return round(max(100 - penalty, 0.0), 2)

def calculate_target_quality_score(
    dataframe: pd.DataFrame,
    target_column: str,
) -> float:
    try:
        target_analysis = analyze_target(
            dataframe,
            target_column,
        )
    except ValueError:
        return 0.0

    if target_analysis.problem_type.value == "classification":
        if target_analysis.class_count is None:
            return 0.0

        if target_analysis.class_count <= 1:
            return 20.0

        return 100.0

    if target_analysis.problem_type.value == "regression":
        return 100.0

    return 0.0

def calculate_leakage_risk_score(
    findings: list,
) -> float:
    if not findings:
        return 100.0

    penalty = 0.0

    severity_penalties = {
        "CRITICAL": 60.0,
        "HIGH": 40.0,
        "MEDIUM": 20.0,
        "LOW": 10.0,
    }

    for finding in findings:
        severity = finding.severity.value
        confidence = finding.confidence

        penalty += (
            severity_penalties.get(severity, 0.0)
            * confidence
        )

    return round(max(100.0 - min(penalty, 100.0), 0.0), 2)
def calculate_distribution_balance_score(
    dataframe: pd.DataFrame,
    target_column: str,
) -> float:
    findings = detect_class_imbalance(
        dataframe,
        target_column,
    )

    if not findings:
        return 100.0

    finding = findings[0]

    severity_scores = {
        "CRITICAL": 0.0,
        "HIGH": 30.0,
        "MEDIUM": 60.0,
        "LOW": 80.0,
    }

    return severity_scores.get(
        finding.severity.value,
        50.0,
    )

def calculate_model_compatibility_score(
    problem_type,
) -> float:
    try:
        models = get_models(problem_type)
    except ValueError:
        return 0.0

    if not models:
        return 0.0

    return 100.0
def build_readiness_score(
    dataframe: pd.DataFrame,
    profile,
    target_column: str,
    leakage_findings: list,
) -> ReadinessScoreResponse:
    target_analysis = analyze_target(
        dataframe,
        target_column,
    )

    dimensions = ReadinessDimensionScores(
        data_quality=calculate_data_quality_score(profile),
        feature_quality=calculate_feature_quality_score(dataframe),
        target_quality=calculate_target_quality_score(
            dataframe,
            target_column,
        ),
        leakage_risk=calculate_leakage_risk_score(
            leakage_findings,
        ),
        distribution_balance=calculate_distribution_balance_score(
            dataframe,
            target_column,
        ),
        model_compatibility=calculate_model_compatibility_score(
            target_analysis.problem_type,
        ),
    )

    return calculate_readiness_score(dimensions)
from app.schemas.readiness import ReadinessDimensionScores
from app.schemas.risk import RiskFinding, RiskSeverity
from app.schemas.target import TargetProblemType
import pandas as pd
from app.services.dataset_profiler import DatasetProfiler
from app.services.readiness_engine import build_readiness_score
from app.services.readiness_engine import (
    calculate_data_quality_score,
    calculate_feature_quality_score,
    calculate_distribution_balance_score,
    calculate_readiness_score,
    calculate_target_quality_score,
    calculate_leakage_risk_score,
    calculate_model_compatibility_score,
)


def test_calculate_readiness_score():
    dimensions = ReadinessDimensionScores(
        data_quality=100,
        feature_quality=100,
        target_quality=100,
        leakage_risk=100,
        distribution_balance=100,
        model_compatibility=100,
    )

    result = calculate_readiness_score(dimensions)

    assert result.overall_score == 100
    assert result.dimensions == dimensions


def test_calculate_readiness_score_with_weighted_values():
    dimensions = ReadinessDimensionScores(
        data_quality=80,
        feature_quality=70,
        target_quality=90,
        leakage_risk=60,
        distribution_balance=85,
        model_compatibility=75,
    )

    result = calculate_readiness_score(dimensions)

    expected = (
        80 * 0.25
        + 70 * 0.20
        + 90 * 0.15
        + 60 * 0.20
        + 85 * 0.10
        + 75 * 0.10
    )

    assert result.overall_score == round(expected, 2)
    
from app.models.profile import DatasetProfile


def test_calculate_data_quality_score_perfect_dataset():
    profile = DatasetProfile(
        rows=100,
        columns=5,
        duplicate_rows=0,
        total_missing_values=0,
        columns_profile=[],
    )

    score = calculate_data_quality_score(profile)

    assert score == 100.0


def test_calculate_data_quality_score_with_missing_and_duplicates():
    profile = DatasetProfile(
        rows=100,
        columns=5,
        duplicate_rows=10,
        total_missing_values=25,
        columns_profile=[],
    )

    score = calculate_data_quality_score(profile)

    expected = 100 - (25 / 500 * 60) - (10 / 100 * 40)

    assert score == round(expected, 2)


def test_calculate_data_quality_score_empty_dataset():
    profile = DatasetProfile(
        rows=0,
        columns=5,
        duplicate_rows=0,
        total_missing_values=0,
        columns_profile=[],
    )

    score = calculate_data_quality_score(profile)

    assert score == 0.0
def test_calculate_feature_quality_score_without_identifier_columns():
    dataframe = pd.DataFrame({
        "age": [21, 22, 23],
        "salary": [30000, 40000, 50000],
    })

    score = calculate_feature_quality_score(dataframe)

    assert score == 100.0


def test_calculate_feature_quality_score_with_identifier_column():
    dataframe = pd.DataFrame({
        "user_id": [1, 2, 3, 4, 5],
        "age": [21, 22, 23, 24, 25],
    })

    score = calculate_feature_quality_score(dataframe)

    assert score == 50.0

def test_calculate_target_quality_score_classification():
    dataframe = pd.DataFrame({
        "age": [20, 21, 22, 23],
        "target": ["yes", "no", "yes", "no"],
    })

    score = calculate_target_quality_score(
        dataframe,
        "target",
    )

    assert score == 100.0


def test_calculate_target_quality_score_regression():
    dataframe = pd.DataFrame({
        "age": [20, 21, 22, 23],
        "target": [50000, 55000, 60000, 65000],
    })

    score = calculate_target_quality_score(
        dataframe,
        "target",
    )

    assert score == 100.0


def test_calculate_target_quality_score_single_class():
    dataframe = pd.DataFrame({
        "age": [20, 21, 22, 23],
        "target": ["yes", "yes", "yes", "yes"],
    })

    score = calculate_target_quality_score(
        dataframe,
        "target",
    )

    assert score == 20.0


def test_calculate_target_quality_score_invalid_target():
    dataframe = pd.DataFrame({
        "age": [20, 21, 22, 23],
    })

    score = calculate_target_quality_score(
        dataframe,
        "target",
    )

    assert score == 0.0

def test_calculate_leakage_risk_score_without_findings():
    score = calculate_leakage_risk_score([])

    assert score == 100.0


def test_calculate_leakage_risk_score_with_high_risk_finding():
    finding = RiskFinding(
        risk_type="TARGET_LEAKAGE",
        severity=RiskSeverity.HIGH,
        column="target",
        title="Potential target leakage",
        evidence={},
        explanation="Potential leakage signal detected.",
        confidence=0.90,
    )

    score = calculate_leakage_risk_score([finding])

    assert score == 64.0


def test_calculate_leakage_risk_score_multiple_findings():
    findings = [
        RiskFinding(
            risk_type="TARGET_LEAKAGE",
            severity=RiskSeverity.HIGH,
            column="feature_1",
            title="Potential target leakage",
            evidence={},
            explanation="Potential leakage signal detected.",
            confidence=1.0,
        ),
        RiskFinding(
            risk_type="TEMPORAL_LEAKAGE",
            severity=RiskSeverity.MEDIUM,
            column="feature_2",
            title="Potential temporal leakage",
            evidence={},
            explanation="Potential temporal leakage signal detected.",
            confidence=0.5,
        ),
    ]

    score = calculate_leakage_risk_score(findings)

    assert score == 50.0
    
def test_calculate_distribution_balance_score_balanced():
    dataframe = pd.DataFrame({
        "target": [0, 0, 1, 1],
    })

    score = calculate_distribution_balance_score(
        dataframe,
        "target",
    )

    assert score == 100.0


def test_calculate_distribution_balance_score_moderate_imbalance():
    dataframe = pd.DataFrame({
        "target": [0] * 85 + [1] * 15,
    })

    score = calculate_distribution_balance_score(
        dataframe,
        "target",
    )

    assert score == 60.0


def test_calculate_distribution_balance_score_severe_imbalance():
    dataframe = pd.DataFrame({
        "target": [0] * 95 + [1] * 5,
    })

    score = calculate_distribution_balance_score(
        dataframe,
        "target",
    )

    assert score == 30.0


def test_calculate_distribution_balance_score_single_class():
    dataframe = pd.DataFrame({
        "target": [1, 1, 1, 1, 1],
    })

    score = calculate_distribution_balance_score(
        dataframe,
        "target",
    )

    assert score == 0.0
    
def test_calculate_model_compatibility_score_classification():
    score = calculate_model_compatibility_score(
        TargetProblemType.CLASSIFICATION
    )

    assert score == 100.0


def test_calculate_model_compatibility_score_regression():
    score = calculate_model_compatibility_score(
        TargetProblemType.REGRESSION
    )

    assert score == 100.0

def test_build_readiness_score():
    dataframe = pd.DataFrame(
        {
            "age": [20, 21, 22, 23],
            "income": [30000, 35000, 40000, 45000],
            "target": [0, 1, 0, 1],
        }
    )

    profile = DatasetProfiler().profile(dataframe)

    result = build_readiness_score(
        dataframe=dataframe,
        profile=profile,
        target_column="target",
        leakage_findings=[],
    )

    assert result.overall_score == 100.0
    assert result.dimensions.data_quality == 100.0
    assert result.dimensions.feature_quality == 100.0
    assert result.dimensions.target_quality == 100.0
    assert result.dimensions.leakage_risk == 100.0
    assert result.dimensions.distribution_balance == 100.0
    assert result.dimensions.model_compatibility == 100.0
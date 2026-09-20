from types import SimpleNamespace

from app.services.report_engine import build_explainable_report
from app.schemas.report import ReportDimensionScores
from app.schemas.recommendation import Recommendation, RecommendationPriority
from app.schemas.risk import RiskFinding, RiskSeverity


def test_build_explainable_report():
    readiness_score = SimpleNamespace(
        overall_score=82.5,
        dimensions=ReportDimensionScores(
            data_quality=90.0,
            feature_quality=80.0,
            target_quality=85.0,
            leakage_risk=75.0,
            distribution_balance=80.0,
            model_compatibility=85.0,
        ),
    )

    findings = [
        RiskFinding(
            risk_type="missing_values",
            severity=RiskSeverity.HIGH,
            column="age",
            title="High missing values",
            evidence={"missing_percentage": 35.0},
            explanation="A feature contains a high percentage of missing values.",
            confidence=0.95,
        )
    ]

    recommendations = [
        Recommendation(
            risk_type="missing_values",
            title="Handle missing values",
            action="Apply an appropriate imputation strategy.",
            priority=RecommendationPriority.HIGH,
            explanation="Apply an appropriate imputation strategy.",
        )
    ]

    result = build_explainable_report(
        dataset_id="test-dataset",
        readiness_score=readiness_score,
        findings=findings,
        recommendations=recommendations,
    )

    assert result.dataset_id == "test-dataset"
    assert result.overall_readiness_score == 82.5
    assert result.dimension_scores.data_quality == 90.0
    assert len(result.key_findings) == 1
    assert result.key_findings[0].severity == "HIGH"
    assert len(result.recommendations) == 1
    
def test_build_explainable_report_with_no_findings():
    readiness_score = SimpleNamespace(
        overall_score=100.0,
        dimensions=ReportDimensionScores(
            data_quality=100.0,
            feature_quality=100.0,
            target_quality=100.0,
            leakage_risk=100.0,
            distribution_balance=100.0,
            model_compatibility=100.0,
        ),
    )

    result = build_explainable_report(
        dataset_id="clean-dataset",
        readiness_score=readiness_score,
        findings=[],
        recommendations=[],
    )

    assert result.dataset_id == "clean-dataset"
    assert result.overall_readiness_score == 100.0
    assert result.key_findings == []
    assert result.recommendations == []


def test_build_explainable_report_multiple_findings_and_recommendations():
    readiness_score = SimpleNamespace(
        overall_score=70.0,
        dimensions=ReportDimensionScores(
            data_quality=70.0,
            feature_quality=65.0,
            target_quality=80.0,
            leakage_risk=60.0,
            distribution_balance=75.0,
            model_compatibility=70.0,
        ),
    )

    findings = [
        SimpleNamespace(
            title="Missing values",
            severity=SimpleNamespace(value="HIGH"),
            explanation="Missing data detected.",
        ),
        SimpleNamespace(
            title="Class imbalance",
            severity=SimpleNamespace(value="MEDIUM"),
            explanation="Target classes are imbalanced.",
        ),
    ]

    recommendations = [
        SimpleNamespace(
            title="Impute missing values",
            explanation="Use an appropriate imputation strategy.",
        ),
        SimpleNamespace(
            title="Handle imbalance",
            explanation="Consider class balancing techniques.",
        ),
    ]

    result = build_explainable_report(
        dataset_id="complex-dataset",
        readiness_score=readiness_score,
        findings=findings,
        recommendations=recommendations,
    )

    assert len(result.key_findings) == 2
    assert len(result.recommendations) == 2
    assert result.key_findings[1].severity == "MEDIUM"
    assert result.recommendations[1].title == "Handle imbalance"
import pytest
from pydantic import ValidationError

from app.schemas.risk import (
    DatasetRiskResponse,
    RiskFinding,
    RiskSeverity,
)


def test_valid_risk_finding():
    finding = RiskFinding(
        risk_type="IDENTIFIER_LIKE_COLUMN",
        severity=RiskSeverity.HIGH,
        column="customer_id",
        title="Identifier-like feature detected",
        evidence={
            "unique_count": 100,
            "row_count": 100,
            "uniqueness_ratio": 1.0,
        },
        explanation="The column is unique for nearly every row.",
        confidence=0.96,
    )

    assert finding.risk_type == "IDENTIFIER_LIKE_COLUMN"
    assert finding.severity == RiskSeverity.HIGH
    assert finding.column == "customer_id"
    assert finding.confidence == 0.96


def test_dataset_risk_response():
    finding = RiskFinding(
        risk_type="IDENTIFIER_LIKE_COLUMN",
        severity=RiskSeverity.HIGH,
        column="customer_id",
        title="Identifier-like feature detected",
        evidence={"uniqueness_ratio": 1.0},
        explanation="The column may be an identifier.",
        confidence=0.95,
    )

    response = DatasetRiskResponse(
        dataset_id="dataset-123",
        findings=[finding],
    )

    assert response.dataset_id == "dataset-123"
    assert len(response.findings) == 1


def test_confidence_cannot_exceed_one():
    with pytest.raises(ValidationError):
        RiskFinding(
            risk_type="TEST",
            severity=RiskSeverity.LOW,
            title="Test",
            evidence={},
            explanation="Test",
            confidence=1.1,
        )


def test_confidence_cannot_be_negative():
    with pytest.raises(ValidationError):
        RiskFinding(
            risk_type="TEST",
            severity=RiskSeverity.LOW,
            title="Test",
            evidence={},
            explanation="Test",
            confidence=-0.1,
        )
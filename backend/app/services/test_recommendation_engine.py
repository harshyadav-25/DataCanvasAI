from app.schemas.risk import RiskFinding, RiskSeverity
from app.services.recommendation_engine import (
    generate_recommendation,
    generate_recommendations,
    prioritize_recommendations,
)
from app.schemas.recommendation import (
    Recommendation,
    RecommendationPriority,
)


def test_missing_value_risk_generates_high_priority_recommendation():
    risk = RiskFinding(
        risk_type="MISSING_VALUES",
        title="Missing values detected",
        severity=RiskSeverity.HIGH,
        column="Age",
        explanation="Age contains a high proportion of missing values.",
        evidence={"missing_percentage": 45.0},
        confidence=0.95,
    )

    recommendation = generate_recommendation(risk)

    assert recommendation.risk_type == "MISSING_VALUES"
    assert recommendation.priority.value == "HIGH"
    assert "missing" in recommendation.action.lower()


def test_class_imbalance_generates_recommendation():
    risk = RiskFinding(
        risk_type="CLASS_IMBALANCE",
        title="Class imbalance detected",
        severity=RiskSeverity.MEDIUM,
        column="Target",
        explanation="Target classes are imbalanced.",
        evidence={"minority_percentage": 15.0},
        confidence=0.95,
    )

    recommendation = generate_recommendation(risk)

    assert recommendation.risk_type == "CLASS_IMBALANCE"
    assert recommendation.priority.value == "MEDIUM"
    assert "precision" in recommendation.action.lower()


def test_identifier_risk_generates_recommendation():
    risk = RiskFinding(
        risk_type="IDENTIFIER_LIKE",
        title="Identifier-like column detected",
        severity=RiskSeverity.HIGH,
        column="Customer_ID",
        explanation="Column appears identifier-like.",
        evidence={"uniqueness_ratio": 1.0},
        confidence=0.95,
    )

    recommendation = generate_recommendation(risk)

    assert recommendation.risk_type == "IDENTIFIER_LIKE"
    assert recommendation.priority.value == "HIGH"
    assert "excluded" in recommendation.action.lower()


def test_single_class_target_is_critical():
    risk = RiskFinding(
        risk_type="SINGLE_CLASS_TARGET",
        title="Single-class target detected",
        severity=RiskSeverity.CRITICAL,
        column="Target",
        explanation="Target contains only one class.",
        evidence={"class_count": 1},
        confidence=1.0,
    )

    recommendation = generate_recommendation(risk)

    assert recommendation.priority.value == "CRITICAL"
    assert "target" in recommendation.action.lower()


def test_multiple_risks_generate_multiple_recommendations():
    risks = [
        RiskFinding(
            risk_type="MISSING_VALUES",
            title="Missing values detected",
            severity=RiskSeverity.HIGH,
            column="Age",
            explanation="Missing values detected.",
            evidence={"missing_percentage": 40.0},
            confidence=0.95,
        ),
        RiskFinding(
            risk_type="IDENTIFIER_LIKE",
            title="Identifier-like column detected",
            severity=RiskSeverity.HIGH,
            column="Customer_ID",
            explanation="Identifier-like column detected.",
            evidence={"uniqueness_ratio": 1.0},
            confidence=0.95,
        ),
    ]

    recommendations = generate_recommendations(risks)

    assert len(recommendations) == 2
    assert recommendations[0].risk_type == "MISSING_VALUES"
    assert recommendations[1].risk_type == "IDENTIFIER_LIKE"


def test_unknown_risk_gets_generic_recommendation():
    risk = RiskFinding(
        risk_type="UNKNOWN_RISK",
        title="Unknown risk detected",
        severity=RiskSeverity.LOW,
        column="Feature",
        explanation="An unknown risk was detected.",
        evidence={},
        confidence=0.5,
    )

    recommendation = generate_recommendation(risk)

    assert recommendation.risk_type == "UNKNOWN_RISK"
    assert recommendation.priority.value == "LOW"

def test_recommendations_are_sorted_by_priority():
    recommendations = [
        Recommendation(
            risk_type="LOW_RISK",
            title="Low risk",
            action="Review this later.",
            priority=RecommendationPriority.LOW,
            explanation="Low priority issue.",
        ),
        Recommendation(
            risk_type="CRITICAL_RISK",
            title="Critical risk",
            action="Fix this immediately.",
            priority=RecommendationPriority.CRITICAL,
            explanation="Critical priority issue.",
        ),
        Recommendation(
            risk_type="HIGH_RISK",
            title="High risk",
            action="Address this issue.",
            priority=RecommendationPriority.HIGH,
            explanation="High priority issue.",
        ),
        Recommendation(
            risk_type="MEDIUM_RISK",
            title="Medium risk",
            action="Review this issue.",
            priority=RecommendationPriority.MEDIUM,
            explanation="Medium priority issue.",
        ),
    ]

    prioritized = prioritize_recommendations(recommendations)

    assert prioritized[0].priority == RecommendationPriority.CRITICAL
    assert prioritized[1].priority == RecommendationPriority.HIGH
    assert prioritized[2].priority == RecommendationPriority.MEDIUM
    assert prioritized[3].priority == RecommendationPriority.LOW


def test_prioritization_does_not_modify_original_list():
    recommendations = [
        Recommendation(
            risk_type="LOW_RISK",
            title="Low risk",
            action="Review later.",
            priority=RecommendationPriority.LOW,
            explanation="Low priority issue.",
        ),
        Recommendation(
            risk_type="HIGH_RISK",
            title="High risk",
            action="Address this issue.",
            priority=RecommendationPriority.HIGH,
            explanation="High priority issue.",
        ),
    ]

    original_order = list(recommendations)

    prioritized = prioritize_recommendations(recommendations)

    assert recommendations == original_order
    assert prioritized[0].priority == RecommendationPriority.HIGH
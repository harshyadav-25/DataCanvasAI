from app.schemas.recommendation import (
    Recommendation,
    RecommendationPriority,
)
from app.schemas.risk import RiskFinding


def generate_recommendation(risk: RiskFinding) -> Recommendation:
    """
    Convert a single risk finding into an actionable recommendation.
    """

    if risk.risk_type == "MISSING_VALUES":
        return Recommendation(
            risk_type=risk.risk_type,
            title="Handle missing values",
            action="Consider imputing or removing missing values before model training.",
            priority=_priority_from_risk(risk.severity),
            explanation=(
                "Missing values can reduce the amount of usable information "
                "available to a machine learning model."
            ),
        )

    if risk.risk_type == "CLASS_IMBALANCE":
        return Recommendation(
            risk_type=risk.risk_type,
            title="Review class imbalance",
            action=(
                "Consider class-balancing techniques and evaluate the model "
                "using precision, recall, and F1-score."
            ),
            priority=_priority_from_risk(risk.severity),
            explanation=(
                "A highly imbalanced target can cause a model to favor the "
                "majority class and make accuracy misleading."
            ),
        )

    if risk.risk_type in {"IDENTIFIER_LIKE", "IDENTIFIER_LIKE_COLUMN"}:
        return Recommendation(
            risk_type=risk.risk_type,
            title="Review identifier-like column",
            action=(
                "Review whether the identifier-like column should be excluded "
                "from machine learning features."
            ),
            priority=_priority_from_risk(risk.severity),
            explanation=(
                "Identifier-like columns often represent record identifiers "
                "rather than meaningful predictive information."
            ),
        )

    if risk.risk_type == "SINGLE_CLASS_TARGET":
        return Recommendation(
            risk_type=risk.risk_type,
            title="Fix target variable",
            action=(
                "Review the target definition or dataset because the target "
                "contains only one class."
            ),
            priority=RecommendationPriority.CRITICAL,
            explanation=(
                "A classification model cannot learn a meaningful distinction "
                "when the target contains only one class."
            ),
        )

    return Recommendation(
        risk_type=risk.risk_type,
        title="Review detected risk",
        action="Review this finding before using the dataset for machine learning.",
        priority=_priority_from_risk(risk.severity),
        explanation=risk.explanation,
    )


def generate_recommendations(
    risks: list[RiskFinding],
) -> list[Recommendation]:
    """
    Generate recommendations for all detected risks.
    """
    return [generate_recommendation(risk) for risk in risks]


def _priority_from_risk(severity) -> RecommendationPriority:
    """
    Map risk severity to recommendation priority.
    """
    if hasattr(severity, "value"):
        severity = severity.value

    mapping = {
        "LOW": RecommendationPriority.LOW,
        "MEDIUM": RecommendationPriority.MEDIUM,
        "HIGH": RecommendationPriority.HIGH,
        "CRITICAL": RecommendationPriority.CRITICAL,
    }

    return mapping.get(
        str(severity),
        RecommendationPriority.MEDIUM,
    )

def prioritize_recommendations(
    recommendations: list[Recommendation],
) -> list[Recommendation]:
    """
    Sort recommendations from highest to lowest priority.
    """

    priority_order = {
        RecommendationPriority.CRITICAL: 0,
        RecommendationPriority.HIGH: 1,
        RecommendationPriority.MEDIUM: 2,
        RecommendationPriority.LOW: 3,
    }

    return sorted(
        recommendations,
        key=lambda recommendation: priority_order[recommendation.priority],
    )
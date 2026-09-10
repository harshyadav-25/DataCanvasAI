import pytest
from pydantic import ValidationError

from app.schemas.recommendation import (
    Recommendation,
    RecommendationPriority,
)


def test_valid_recommendation():
    recommendation = Recommendation(
        risk_type="MISSING_VALUES",
        title="Handle missing values",
        action="Consider imputing missing values before model training.",
        priority=RecommendationPriority.HIGH,
        explanation="A high proportion of missing values can reduce usable information.",
    )

    assert recommendation.risk_type == "MISSING_VALUES"
    assert recommendation.priority == RecommendationPriority.HIGH


def test_recommendation_requires_title():
    with pytest.raises(ValidationError):
        Recommendation(
            risk_type="MISSING_VALUES",
            title="",
            action="Handle missing values.",
            priority=RecommendationPriority.HIGH,
            explanation="Missing values were detected.",
        )


def test_recommendation_requires_action():
    with pytest.raises(ValidationError):
        Recommendation(
            risk_type="MISSING_VALUES",
            title="Handle missing values",
            action="",
            priority=RecommendationPriority.HIGH,
            explanation="Missing values were detected.",
        )


def test_recommendation_requires_explanation():
    with pytest.raises(ValidationError):
        Recommendation(
            risk_type="MISSING_VALUES",
            title="Handle missing values",
            action="Handle missing values.",
            priority=RecommendationPriority.HIGH,
            explanation="",
        )
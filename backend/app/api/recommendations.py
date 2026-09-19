from fastapi import APIRouter

from app.schemas.recommendation import Recommendation
from app.schemas.risk import RiskFinding
from app.services.recommendation_engine import (
    generate_recommendations,
    prioritize_recommendations,
)

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)
@router.post(
    "/generate",
    response_model=list[Recommendation],
)
async def generate_recommendation_endpoint(
    risks: list[RiskFinding],
) -> list[Recommendation]:
    recommendations = generate_recommendations(risks)

    return prioritize_recommendations(recommendations)
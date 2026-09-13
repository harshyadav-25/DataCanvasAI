from enum import Enum

from pydantic import BaseModel, Field


class RecommendationPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Recommendation(BaseModel):
    risk_type: str = Field(min_length=1)
    title: str = Field(min_length=1)
    action: str = Field(min_length=1)
    priority: RecommendationPriority
    explanation: str = Field(min_length=1)
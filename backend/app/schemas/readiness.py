from pydantic import BaseModel, Field


class ReadinessDimensionScores(BaseModel):
    data_quality: float = Field(ge=0, le=100)
    feature_quality: float = Field(ge=0, le=100)
    target_quality: float = Field(ge=0, le=100)
    leakage_risk: float = Field(ge=0, le=100)
    distribution_balance: float = Field(ge=0, le=100)
    model_compatibility: float = Field(ge=0, le=100)


class ReadinessScoreResponse(BaseModel):
    overall_score: float = Field(ge=0, le=100)
    dimensions: ReadinessDimensionScores
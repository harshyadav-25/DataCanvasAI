from pydantic import BaseModel, Field


class ReportDimensionScores(BaseModel):
    data_quality: float = Field(ge=0, le=100)
    feature_quality: float = Field(ge=0, le=100)
    target_quality: float = Field(ge=0, le=100)
    leakage_risk: float = Field(ge=0, le=100)
    distribution_balance: float = Field(ge=0, le=100)
    model_compatibility: float = Field(ge=0, le=100)


class ReportFinding(BaseModel):
    title: str
    severity: str
    explanation: str


class ReportRecommendation(BaseModel):
    title: str
    explanation: str


class ExplainableReport(BaseModel):
    dataset_id: str
    overall_readiness_score: float = Field(ge=0, le=100)
    dimension_scores: ReportDimensionScores
    key_findings: list[ReportFinding]
    recommendations: list[ReportRecommendation]
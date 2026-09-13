from enum import Enum

from pydantic import BaseModel, Field


class RiskSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RiskFinding(BaseModel):
    risk_type: str
    severity: RiskSeverity
    column: str | None = None
    title: str
    evidence: dict
    explanation: str
    confidence: float = Field(ge=0.0, le=1.0)


class DatasetRiskResponse(BaseModel):
    dataset_id: str
    findings: list[RiskFinding]
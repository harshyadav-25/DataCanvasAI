from enum import Enum

from pydantic import BaseModel


class TargetProblemType(str, Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"


class TargetAnalysis(BaseModel):
    target_column: str
    problem_type: TargetProblemType
    class_count: int | None = None
from pydantic import BaseModel, Field

from app.schemas.target import TargetProblemType


class ExperimentResult(BaseModel):
    model_name: str = Field(min_length=1)
    problem_type: TargetProblemType
    mean_metrics: dict[str, float]
    std_metrics: dict[str, float]


class ExperimentComparison(BaseModel):
    target_column: str = Field(min_length=1)
    problem_type: TargetProblemType
    primary_metric: str = Field(min_length=1)
    results: list[ExperimentResult]
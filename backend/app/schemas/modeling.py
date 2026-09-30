from pydantic import BaseModel, Field

from app.schemas.target import TargetProblemType


class ModelTrainingResult(BaseModel):
    model_name: str = Field(min_length=1)
    fold_metrics: list[dict[str, float]]
    mean_metrics: dict[str, float]
    std_metrics: dict[str, float]


class ModelTrainingResponse(BaseModel):
    dataset_id: str = Field(min_length=1)
    target_column: str = Field(min_length=1)
    problem_type: TargetProblemType
    model_name: str = Field(min_length=1)
    evaluation_method: str = "cross_validation"
    n_splits: int = Field(ge=2)
    results: list[ModelTrainingResult]

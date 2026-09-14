from pydantic import BaseModel, Field
from app.schemas.target import TargetProblemType


class ValidationResult(BaseModel):
    target_column: str = Field(min_length=1)
    problem_type: TargetProblemType
    metric_name: str = Field(min_length=1)
    metric_value: float
    train_rows: int = Field(ge=0)
    test_rows: int = Field(ge=0)

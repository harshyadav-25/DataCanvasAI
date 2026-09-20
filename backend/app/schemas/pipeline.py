from pydantic import BaseModel, Field

from app.schemas.target import TargetProblemType


class PipelineCodeRequest(BaseModel):
    target_column: str = Field(min_length=1)
    problem_type: TargetProblemType
    model_name: str = Field(min_length=1)
    identifier_columns: list[str] = []


class PipelineCodeResponse(BaseModel):
    target_column: str
    problem_type: TargetProblemType
    model_name: str
    code: str = Field(min_length=1)
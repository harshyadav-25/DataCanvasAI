from enum import Enum

from pydantic import BaseModel, Field


class SimulationTransformation(str, Enum):
    MEDIAN_IMPUTATION = "MEDIAN_IMPUTATION"


class SimulationRequest(BaseModel):
    column: str = Field(min_length=1)
    transformation: SimulationTransformation


class SimulationResult(BaseModel):
    column: str = Field(min_length=1)
    transformation: SimulationTransformation
    missing_values_before: int = Field(ge=0)
    missing_values_after: int = Field(ge=0)
    rows_affected: int = Field(ge=0)
    changed: bool
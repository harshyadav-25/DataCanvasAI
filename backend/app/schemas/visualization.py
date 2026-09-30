from typing import Literal

from pydantic import BaseModel, Field


class NumericSummary(BaseModel):
    minimum: float
    first_quartile: float
    median: float
    third_quartile: float
    maximum: float
    mean: float


class VisualizationChart(BaseModel):
    column: str = Field(min_length=1)
    chart_type: Literal["histogram", "bar"]
    title: str = Field(min_length=1)
    x_axis_label: str = Field(min_length=1)
    y_axis_label: str = Field(min_length=1)
    series_name: str = Field(min_length=1)
    labels: list[str]
    values: list[int]
    missing_count: int = Field(ge=0)
    numeric_summary: NumericSummary | None = None


class VisualizationResponse(BaseModel):
    dataset_id: str = Field(min_length=1)
    target_column: str | None
    rows: int = Field(ge=0)
    columns: int = Field(ge=0)
    charts: list[VisualizationChart]

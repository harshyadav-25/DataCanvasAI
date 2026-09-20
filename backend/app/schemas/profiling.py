from pydantic import BaseModel


class ColumnProfileResponse(BaseModel):
    name: str
    dtype: str
    missing_count: int
    missing_percentage: float
    unique_count: int


class DatasetProfileResponse(BaseModel):
    dataset_id: str
    rows: int
    columns: int
    duplicate_rows: int
    total_missing_values: int
    columns_profile: list[ColumnProfileResponse]

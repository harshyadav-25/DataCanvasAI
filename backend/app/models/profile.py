from dataclasses import dataclass


@dataclass(frozen=True)
class ColumnProfile:
    name: str
    dtype: str
    missing_count: int
    missing_percentage: float
    unique_count: int


@dataclass(frozen=True)
class DatasetProfile:
    rows: int
    columns: int
    duplicate_rows: int
    total_missing_values: int
    columns_profile: list[ColumnProfile]
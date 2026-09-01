from dataclasses import dataclass


@dataclass(frozen=True)
class DatasetRecord:
    dataset_id: str
    filename: str
    file_type: str
    rows: int
    columns: int
    column_names: list[str]
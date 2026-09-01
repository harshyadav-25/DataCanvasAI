from pydantic import BaseModel


class DatasetUploadResponse(BaseModel):
    dataset_id: str
    filename: str
    file_type: str
    rows: int
    columns: int
    column_names: list[str]
    message: str
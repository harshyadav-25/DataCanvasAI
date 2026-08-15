from pydantic import BaseModel


class DatasetUploadResponse(BaseModel):
    filename: str
    file_type: str
    rows: int
    columns: int
    column_names: list[str]
    message: str
from pydantic import BaseModel


class PreprocessingResponse(BaseModel):
    dataset_id: str
    target_column: str
    feature_names: list[str]
    feature_groups: dict[str, list[str]]
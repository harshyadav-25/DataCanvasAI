from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user
from app.schemas.modeling import ModelTrainingResponse
from app.schemas.target import TargetProblemType
from app.services.modeling_engine import train_selected_model
from app.services.registry import dataset_registry
from app.services.validation_engine import get_models


router = APIRouter(
    prefix="/modeling",
    tags=["Modeling"],
)


@router.post(
    "/train/{dataset_id}",
    response_model=ModelTrainingResponse,
)
async def train_model(
    dataset_id: str,
    target_column: str,
    problem_type: TargetProblemType,
    model_name: str,
    identifier_columns: list[str] | None = None,
    n_splits: int = Query(default=2, ge=2, le=10),
    current_user: dict = Depends(get_current_user),
) -> ModelTrainingResponse:
    dataframe = dataset_registry.get_working_copy(dataset_id)
    if target_column not in dataframe.columns:
        raise HTTPException(status_code=422, detail="Target column was not found in the dataset.")
    if identifier_columns:
        invalid_identifiers = set(identifier_columns) - set(dataframe.columns)
        if invalid_identifiers:
            raise HTTPException(
                status_code=422,
                detail=f"Identifier columns were not found: {', '.join(sorted(invalid_identifiers))}",
            )
        if target_column in identifier_columns:
            raise HTTPException(
                status_code=422,
                detail="The target column cannot also be an identifier column.",
            )
    if model_name not in get_models(problem_type):
        raise HTTPException(
            status_code=422,
            detail=f"Model '{model_name}' is not supported for {problem_type.value}.",
        )

    try:
        return train_selected_model(
            dataset_id=dataset_id,
            dataframe=dataframe,
            target_column=target_column,
            problem_type=problem_type,
            model_name=model_name,
            identifier_columns=identifier_columns,
            n_splits=n_splits,
        )
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.schemas.target import TargetProblemType
from app.schemas.validation import (
    ModelValidationResult,
    ValidationResponse,
)
from app.services.registry import dataset_registry
from app.services.validation_engine import cross_validate_with_preprocessing


router = APIRouter(
    prefix="/validation",
    tags=["Validation"],
)


@router.post(
    "/analyze/{dataset_id}",
    response_model=ValidationResponse,
)
async def analyze_validation(
    dataset_id: str,
    target_column: str,
    problem_type: TargetProblemType,
    identifier_columns: list[str] | None = None,
    n_splits: int = 5,
    current_user: dict = Depends(get_current_user),
) -> ValidationResponse:

    dataframe = dataset_registry.get_working_copy(dataset_id)

    validation_results = cross_validate_with_preprocessing(
        dataframe=dataframe,
        target_column=target_column,
        problem_type=problem_type,
        identifier_columns=identifier_columns,
        n_splits=n_splits,
    )

    results = [
        ModelValidationResult(
            model_name=result["model_name"],
            mean_metrics=result["mean_metrics"],
            std_metrics=result["std_metrics"],
        )
        for result in validation_results.values()
    ]

    return ValidationResponse(
        target_column=target_column,
        problem_type=problem_type,
        results=results,
    )
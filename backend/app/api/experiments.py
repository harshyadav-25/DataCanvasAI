"""
Experiments API router.

Endpoint: POST /experiments/compare/{dataset_id}

Accepts user-selected model names (min 2 for comparison).
Validates model names against the validation engine.
Supports bypass_cache (Run Fresh) to force recalculation.
Uses per-model caching and partial cache reuse.
"""

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user
from app.schemas.experiment import ExperimentComparison
from app.schemas.target import TargetProblemType
from app.services.experiment_engine import (
    run_experiment_comparison,
    validate_model_names,
)
from app.services.registry import dataset_registry
from app.services.validation_engine import get_models


router = APIRouter(
    prefix="/experiments",
    tags=["Experiments"],
)


@router.post(
    "/compare/{dataset_id}",
    response_model=ExperimentComparison,
)
async def compare_dataset_experiments(
    dataset_id: str,
    target_column: str,
    problem_type: TargetProblemType,
    model_names: list[str] = Query(default=[]),
    identifier_columns: list[str] = Query(default=[]),
    n_splits: int = 3,
    bypass_cache: bool = False,
    current_user: dict = Depends(get_current_user),
) -> ExperimentComparison:
    """
    Compare selected models using cross-validation with preprocessing.

    - **model_names**: list of model names to compare (min 2 required).
    - **bypass_cache**: set to true to force fresh recalculation.
    - **n_splits**: number of CV folds.
    - **identifier_columns**: columns to exclude from features.
    """

    # ----------------------------------------------------------------
    # Backend validation: model names (not just frontend)
    # ----------------------------------------------------------------

    # If no model_names provided, default to all available models
    # for backward compatibility — but still require ≥ 2
    if not model_names:
        available = get_models(problem_type)
        model_names = list(available.keys())

    try:
        validate_model_names(model_names, problem_type)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    # ----------------------------------------------------------------
    # Load dataset
    # ----------------------------------------------------------------
    dataframe = dataset_registry.get_working_copy(dataset_id)

    # ----------------------------------------------------------------
    # Run comparison
    # ----------------------------------------------------------------
    try:
        return run_experiment_comparison(
            dataframe=dataframe,
            dataset_id=dataset_id,
            target_column=target_column,
            problem_type=problem_type,
            model_names=model_names,
            identifier_columns=identifier_columns or [],
            n_splits=n_splits,
            bypass_cache=bypass_cache,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
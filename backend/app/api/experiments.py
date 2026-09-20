from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.schemas.experiment import ExperimentComparison
from app.schemas.target import TargetProblemType
from app.services.experiment_engine import run_experiment_comparison
from app.services.registry import dataset_registry


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
    identifier_columns: list[str] | None = None,
    n_splits: int = 5,
    current_user: dict = Depends(get_current_user),
) -> ExperimentComparison:
    dataframe = dataset_registry.get_working_copy(dataset_id)

    return run_experiment_comparison(
        dataframe=dataframe,
        target_column=target_column,
        problem_type=problem_type,
        identifier_columns=identifier_columns,
        n_splits=n_splits,
    )
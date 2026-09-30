from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_current_user
from app.schemas.visualization import VisualizationResponse
from app.services.registry import dataset_registry
from app.services.visualization_engine import build_visualization


router = APIRouter(
    prefix="/visualization",
    tags=["Visualization"],
)


@router.post(
    "/analyze/{dataset_id}",
    response_model=VisualizationResponse,
)
async def analyze_visualization(
    dataset_id: str,
    target_column: str | None = None,
    current_user: dict = Depends(get_current_user),
) -> VisualizationResponse:
    dataframe = dataset_registry.get_working_copy(dataset_id)

    if target_column and target_column not in dataframe.columns:
        raise HTTPException(
            status_code=400,
            detail=f"Target column '{target_column}' was not found in the dataset.",
        )

    return build_visualization(
        dataframe=dataframe,
        dataset_id=dataset_id,
        target_column=target_column,
    )

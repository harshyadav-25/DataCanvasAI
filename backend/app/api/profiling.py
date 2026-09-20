from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.schemas.profiling import (
    ColumnProfileResponse,
    DatasetProfileResponse,
)
from app.services.dataset_profiler import DatasetProfiler
from app.services.registry import dataset_registry

router = APIRouter(prefix="/profiling", tags=["Profiling"])


@router.post(
    "/analyze/{dataset_id}",
    response_model=DatasetProfileResponse,
)
async def analyze_profiling(
    dataset_id: str,
    current_user: dict = Depends(get_current_user),
) -> DatasetProfileResponse:
    profile = DatasetProfiler().profile(
        dataset_registry.get_working_copy(dataset_id)
    )

    return DatasetProfileResponse(
        dataset_id=dataset_id,
        rows=profile.rows,
        columns=profile.columns,
        duplicate_rows=profile.duplicate_rows,
        total_missing_values=profile.total_missing_values,
        columns_profile=[
            ColumnProfileResponse(
                name=column.name,
                dtype=column.dtype,
                missing_count=column.missing_count,
                missing_percentage=column.missing_percentage,
                unique_count=column.unique_count,
            )
            for column in profile.columns_profile
        ],
    )

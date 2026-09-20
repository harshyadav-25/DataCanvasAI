from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.schemas.readiness import ReadinessScoreResponse
from app.services.dataset_profiler import DatasetProfiler
from app.services.dataset_risk_engine import detect_dataset_risks
from app.services.readiness_engine import build_readiness_score
from app.services.registry import dataset_registry


router = APIRouter(
    prefix="/readiness",
    tags=["ML Readiness"],
)


@router.post(
    "/analyze/{dataset_id}",
    response_model=ReadinessScoreResponse,
)
async def analyze_dataset_readiness(
    dataset_id: str,
    target_column: str,
    current_user: dict = Depends(get_current_user),
) -> ReadinessScoreResponse:
    dataframe = dataset_registry.get_working_copy(dataset_id)

    profile = DatasetProfiler().profile(dataframe)

    risk_findings = detect_dataset_risks(
        dataframe,
        target_column=target_column,
    )

    return build_readiness_score(
        dataframe=dataframe,
        profile=profile,
        target_column=target_column,
        leakage_findings=[],
    )
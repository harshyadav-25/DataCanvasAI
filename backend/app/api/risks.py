from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.schemas.risk import DatasetRiskResponse
from app.services.dataset_risk_engine import detect_dataset_risks
from app.services.registry import dataset_registry

router = APIRouter(
    prefix="/risks",
    tags=["Risk Analysis"],
)
@router.post(
    "/analyze/{dataset_id}",
    response_model=DatasetRiskResponse,
)
async def analyze_dataset_risks(
    dataset_id: str,
    target_column: str | None = None,
    current_user: dict = Depends(get_current_user),
) -> DatasetRiskResponse:
    dataframe = dataset_registry.get_working_copy(dataset_id)

    findings = detect_dataset_risks(
        dataframe,
        target_column=target_column,
    )

    return DatasetRiskResponse(
        dataset_id=dataset_id,
        findings=findings,
    )
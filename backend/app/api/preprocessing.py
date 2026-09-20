from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.schemas.preprocessing import PreprocessingResponse
from app.services.dataset_risk_engine import detect_identifier_like_columns
from app.services.preprocessing_engine import PreprocessingEngine
from app.services.registry import dataset_registry


router = APIRouter(
    prefix="/preprocessing",
    tags=["Preprocessing"],
)


@router.post(
    "/analyze/{dataset_id}",
    response_model=PreprocessingResponse,
)
async def analyze_preprocessing(
    dataset_id: str,
    target_column: str,
    current_user: dict = Depends(get_current_user),
) -> PreprocessingResponse:
    dataframe = dataset_registry.get_working_copy(dataset_id)

    identifier_findings = detect_identifier_like_columns(dataframe)

    identifier_columns = [
        finding.column
        for finding in identifier_findings
        if finding.column is not None
    ]

    engine = PreprocessingEngine(
        target_column=target_column,
        identifier_columns=identifier_columns,
    )

    engine.fit(dataframe)

    return PreprocessingResponse(
        dataset_id=dataset_id,
        target_column=target_column,
        feature_names=engine.get_feature_names(),
        feature_groups=engine.get_feature_groups(),
    )
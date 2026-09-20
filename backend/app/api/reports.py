from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.schemas.report import ExplainableReport
from app.services.dataset_profiler import DatasetProfiler
from app.services.dataset_risk_engine import detect_dataset_risks
from app.services.readiness_engine import build_readiness_score
from app.services.recommendation_engine import (
    generate_recommendations,
    prioritize_recommendations,
)
from app.services.report_engine import build_explainable_report
from app.services.registry import dataset_registry



router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.post(
    "/generate/{dataset_id}",
    response_model=ExplainableReport,
)
async def generate_report(
    dataset_id: str,
    target_column: str,
    current_user: dict = Depends(get_current_user),
) -> ExplainableReport:
    dataframe = dataset_registry.get_working_copy(dataset_id)

    profile = DatasetProfiler().profile(dataframe)

    findings = detect_dataset_risks(
        dataframe,
        target_column=target_column,
    )

    readiness_score = build_readiness_score(
        dataframe=dataframe,
        profile=profile,
        target_column=target_column,
        leakage_findings=[],
    )

    recommendations = generate_recommendations(findings)
    recommendations = prioritize_recommendations(recommendations)

    return build_explainable_report(
        dataset_id=dataset_id,
        readiness_score=readiness_score,
        findings=findings,
        recommendations=recommendations,
    )
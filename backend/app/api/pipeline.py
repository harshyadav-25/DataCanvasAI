from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.schemas.pipeline import PipelineCodeRequest, PipelineCodeResponse
from app.services.pipeline_generator import generate_pipeline_code

router = APIRouter(
    prefix="/pipeline",
    tags=["Pipeline"],
)


@router.post(
    "/generate",
    response_model=PipelineCodeResponse,
)
async def generate_pipeline(
    request: PipelineCodeRequest,
    current_user: dict = Depends(get_current_user),
) -> PipelineCodeResponse:

    try:
        code = generate_pipeline_code(request)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return PipelineCodeResponse(
        target_column=request.target_column,
        problem_type=request.problem_type,
        model_name=request.model_name,
        code=code,
    )
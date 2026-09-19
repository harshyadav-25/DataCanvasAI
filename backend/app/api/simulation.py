from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_current_user
from app.schemas.simulation import SimulationRequest, SimulationResult
from app.services.registry import dataset_registry
from app.services.simulation_engine import simulate_transformation

router = APIRouter(
    prefix="/simulation",
    tags=["Simulation"],
)
@router.post(
    "/run/{dataset_id}",
    response_model=SimulationResult,
)
async def run_simulation(
    dataset_id: str,
    request: SimulationRequest,
    current_user: dict = Depends(get_current_user),
) -> SimulationResult:
    dataframe = dataset_registry.get_working_copy(dataset_id)

    try:
        _, result = simulate_transformation(
            dataframe,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    return result
import pytest
from pydantic import ValidationError

from app.schemas.simulation import (
    SimulationRequest,
    SimulationResult,
    SimulationTransformation,
)


def test_valid_simulation_request():
    request = SimulationRequest(
        column="Age",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
    )

    assert request.column == "Age"
    assert request.transformation == SimulationTransformation.MEDIAN_IMPUTATION


def test_simulation_request_requires_column():
    with pytest.raises(ValidationError):
        SimulationRequest(
            column="",
            transformation=SimulationTransformation.MEDIAN_IMPUTATION,
        )


def test_valid_simulation_result():
    result = SimulationResult(
        column="Age",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
        missing_values_before=20,
        missing_values_after=0,
        rows_affected=20,
        changed=True,
    )

    assert result.missing_values_before == 20
    assert result.missing_values_after == 0
    assert result.rows_affected == 20
    assert result.changed is True


def test_simulation_result_rejects_negative_values():
    with pytest.raises(ValidationError):
        SimulationResult(
            column="Age",
            transformation=SimulationTransformation.MEDIAN_IMPUTATION,
            missing_values_before=-1,
            missing_values_after=0,
            rows_affected=0,
            changed=False,
        )
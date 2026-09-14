import pandas as pd
import pytest

from app.schemas.simulation import (
    SimulationRequest,
    SimulationTransformation,
)
from app.services.simulation_engine import simulate_transformation


def test_median_imputation_fills_missing_values():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 25, None, 30, None],
        }
    )

    request = SimulationRequest(
        column="Age",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
    )

    result_dataframe, result = simulate_transformation(
        dataframe,
        request,
    )

    assert result.missing_values_before == 2
    assert result.missing_values_after == 0
    assert result.rows_affected == 2
    assert result.changed is True


def test_original_dataframe_is_not_modified():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 25, None, 30],
        }
    )

    original_missing = int(dataframe["Age"].isna().sum())

    request = SimulationRequest(
        column="Age",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
    )

    simulate_transformation(dataframe, request)

    assert int(dataframe["Age"].isna().sum()) == original_missing


def test_median_imputation_uses_correct_median():
    dataframe = pd.DataFrame(
        {
            "Age": [10, 20, None, 30],
        }
    )

    request = SimulationRequest(
        column="Age",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
    )

    result_dataframe, result = simulate_transformation(
        dataframe,
        request,
    )

    assert result_dataframe.loc[2, "Age"] == 20
    assert result.rows_affected == 1


def test_missing_column_raises_error():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 25, None],
        }
    )

    request = SimulationRequest(
        column="Salary",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
    )

    with pytest.raises(ValueError, match="does not exist"):
        simulate_transformation(dataframe, request)


def test_median_imputation_requires_numeric_column():
    dataframe = pd.DataFrame(
        {
            "City": ["Kanpur", None, "Delhi"],
        }
    )

    request = SimulationRequest(
        column="City",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
    )

    with pytest.raises(ValueError, match="numeric column"):
        simulate_transformation(dataframe, request)


def test_all_missing_numeric_column_raises_error():
    dataframe = pd.DataFrame(
        {
            "Age": [None, None, None],
        }
    )

    request = SimulationRequest(
        column="Age",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
    )

    with pytest.raises(
        ValueError,
        match="no valid numeric values",
    ):
        simulate_transformation(dataframe, request)


def test_column_without_missing_values_reports_no_change():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 25, 30],
        }
    )

    request = SimulationRequest(
        column="Age",
        transformation=SimulationTransformation.MEDIAN_IMPUTATION,
    )

    result_dataframe, result = simulate_transformation(
        dataframe,
        request,
    )

    assert result.missing_values_before == 0
    assert result.missing_values_after == 0
    assert result.rows_affected == 0
    assert result.changed is False
    pd.testing.assert_frame_equal(result_dataframe, dataframe)
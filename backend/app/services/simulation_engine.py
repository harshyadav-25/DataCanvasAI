import pandas as pd

from app.schemas.simulation import (
    SimulationRequest,
    SimulationResult,
    SimulationTransformation,
)


def simulate_transformation(
    dataframe: pd.DataFrame,
    request: SimulationRequest,
) -> tuple[pd.DataFrame, SimulationResult]:
    """
    Apply a requested transformation to a copy of the dataframe.

    The original dataframe is never modified.
    """

    if request.column not in dataframe.columns:
        raise ValueError(
            f"Column '{request.column}' does not exist in the dataset."
        )

    working_dataframe = dataframe.copy(deep=True)

    missing_values_before = int(
        working_dataframe[request.column].isna().sum()
    )

    if request.transformation == SimulationTransformation.MEDIAN_IMPUTATION:
        column = working_dataframe[request.column]

        if column.dropna().empty:
            raise ValueError(
                "Cannot perform median imputation because the column "
                "contains no valid numeric values."
            )

        if not pd.api.types.is_numeric_dtype(column):
            raise ValueError(
                "Median imputation requires a numeric column."
            )

        median_value = column.median()

        if pd.isna(median_value):
            raise ValueError(
                "Cannot perform median imputation because the column "
                "contains no valid numeric values."
            )

        working_dataframe[request.column] = column.fillna(median_value)

        
    elif request.transformation == SimulationTransformation.MOST_FREQUENT_IMPUTATION:
        column = working_dataframe[request.column]

        if column.dropna().empty:
            raise ValueError(
                "Cannot perform most-frequent imputation because the column "
                "contains no valid values."
            )

        most_frequent_value = column.mode().iloc[0]

        working_dataframe[request.column] = column.fillna(
            most_frequent_value
        )
    elif request.transformation == SimulationTransformation.MEAN_IMPUTATION:
        column = working_dataframe[request.column]

        if column.dropna().empty:
            raise ValueError(
                "Cannot perform mean imputation because the column "
                "contains no valid numeric values."
            )

        if not pd.api.types.is_numeric_dtype(column):
            raise ValueError(
                "Mean imputation requires a numeric column."
            )

        mean_value = column.mean()

        if pd.isna(mean_value):
            raise ValueError(
                "Cannot perform mean imputation because the column "
                "contains no valid numeric values."
            )

        working_dataframe[request.column] = column.fillna(mean_value)
    else:
        raise ValueError(
            f"Unsupported transformation: {request.transformation}"
        )

    missing_values_after = int(
        working_dataframe[request.column].isna().sum()
    )

    rows_affected = missing_values_before - missing_values_after

    result = SimulationResult(
        column=request.column,
        transformation=request.transformation,
        missing_values_before=missing_values_before,
        missing_values_after=missing_values_after,
        rows_affected=rows_affected,
        changed=rows_affected > 0,
    )

    return working_dataframe, result
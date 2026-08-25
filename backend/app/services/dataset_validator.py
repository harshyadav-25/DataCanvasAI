import pandas as pd

from app.exceptions.dataset import DatasetValidationError


def validate_dataset(dataframe: pd.DataFrame) -> None:
    if dataframe.empty:
        raise DatasetValidationError(
            "The dataset contains no rows."
        )

    if dataframe.shape[1] == 0:
        raise DatasetValidationError(
            "The dataset contains no columns."
        )

    duplicated_columns = dataframe.columns[
        dataframe.columns.duplicated()
    ].tolist()

    if duplicated_columns:
        raise DatasetValidationError(
            f"Duplicate column names found: {duplicated_columns}"
        )
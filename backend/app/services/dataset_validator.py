from app.exceptions.dataset import DatasetValidationError


def validate_dataset(dataframe) -> None:
    if dataframe.shape[1] == 0:
        raise DatasetValidationError(
            "The dataset contains no columns."
        )

    if dataframe.shape[0] == 0:
        raise DatasetValidationError(
            "The dataset contains no rows."
        )

    duplicated_columns = dataframe.columns[
        dataframe.columns.duplicated()
    ].tolist()

    if duplicated_columns:
        raise DatasetValidationError(
            f"Duplicate column names found: {duplicated_columns}"
        )
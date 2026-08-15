import pandas as pd


def validate_dataset(dataframe: pd.DataFrame) -> None:
    """
    Validate whether a DataFrame is usable for further DataCanvasAI analysis.

    Args:
        dataframe: Dataset represented as a Pandas DataFrame.

    Raises:
        ValueError: If the dataset fails validation.
    """

    if dataframe.empty:
        raise ValueError("The dataset contains no rows.")

    if dataframe.shape[1] == 0:
        raise ValueError("The dataset contains no columns.")

    duplicated_columns = dataframe.columns[
        dataframe.columns.duplicated()
    ].tolist()

    if duplicated_columns:
        raise ValueError(
            f"Duplicate column names found: {duplicated_columns}"
        )
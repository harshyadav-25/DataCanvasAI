from pathlib import Path
from io import BytesIO

import pandas as pd


SUPPORTED_EXTENSIONS = {".csv", ".xlsx"}


def load_dataset(file_content: bytes, filename: str) -> pd.DataFrame:
    extension = Path(filename).suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format: {extension}. "
            "Supported formats are CSV and XLSX."
        )

    try:
        # Handle completely empty uploaded files before Pandas tries to read them.
        if not file_content:
            raise ValueError("The uploaded dataset is empty.")

        file = BytesIO(file_content)

        if extension == ".csv":
            dataframe = pd.read_csv(file)
        else:
            dataframe = pd.read_excel(file)

    except ValueError:
        # Preserve our intentional validation errors.
        raise

    except Exception as error:
        raise ValueError(
            f"Unable to read dataset '{filename}'. "
            "The file may be corrupted or incorrectly formatted."
        ) from error

    if dataframe.empty:
        raise ValueError("The uploaded dataset is empty.")

    return dataframe
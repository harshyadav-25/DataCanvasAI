from pathlib import Path
from io import BytesIO, StringIO
import csv

import pandas as pd

from app.exceptions.dataset import (
    UnsupportedFileTypeError,
    EmptyDatasetError,
    DatasetReadError,
    DatasetValidationError,
)


SUPPORTED_EXTENSIONS = {".csv", ".xlsx"}


def load_dataset(file_content: bytes, filename: str) -> pd.DataFrame:
    extension = Path(filename).suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise UnsupportedFileTypeError(
            f"Unsupported file format: {extension}. "
            "Supported formats are CSV and XLSX."
        )

    if not file_content:
        raise EmptyDatasetError(
            "The uploaded dataset is empty."
        )

    try:
        if extension == ".csv":
            text_content = file_content.decode("utf-8")

            reader = csv.reader(StringIO(text_content))
            header = next(reader, None)

            if not header:
                raise EmptyDatasetError(
                    "The uploaded dataset is empty."
                )

            if len(header) != len(set(header)):
                duplicated_columns = [
                    column
                    for column in dict.fromkeys(header)
                    if header.count(column) > 1
                ]

                raise DatasetValidationError(
                    f"Duplicate column names found: {duplicated_columns}"
                )

            file = BytesIO(file_content)
            dataframe = pd.read_csv(file)

        else:
            file = BytesIO(file_content)
            dataframe = pd.read_excel(file)

    except (
        UnsupportedFileTypeError,
        EmptyDatasetError,
        DatasetValidationError,
    ):
        raise

    except UnicodeDecodeError as error:
        raise DatasetReadError(
            f"Unable to read dataset '{filename}'. "
            "The file may be corrupted or incorrectly formatted."
        ) from error

    except Exception as error:
        raise DatasetReadError(
            f"Unable to read dataset '{filename}'. "
            "The file may be corrupted or incorrectly formatted."
        ) from error

    if dataframe.empty:
        raise EmptyDatasetError(
            "The uploaded dataset is empty."
        )

    return dataframe
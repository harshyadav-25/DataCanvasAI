import pandas as pd
import pytest

from app.services.dataset_validator import validate_dataset
from app.exceptions.dataset import DatasetValidationError


def test_valid_dataset():
    dataframe = pd.DataFrame(
        {
            "Name": ["Harsh", "Rahul"],
            "Age": [21, 22],
            "Salary": [45000, 50000],
        }
    )

    validate_dataset(dataframe)


def test_duplicate_columns():
    dataframe = pd.DataFrame(
        [
            ["Harsh", 21, 45000],
            ["Rahul", 22, 50000],
        ],
        columns=["Name", "Age", "Age"],
    )

    with pytest.raises(
        DatasetValidationError,
        match="Duplicate column names found",
    ):
        validate_dataset(dataframe)


def test_zero_row_dataset():
    dataframe = pd.DataFrame(
        {
            "Name": [],
            "Age": [],
        }
    )

    with pytest.raises(
        DatasetValidationError,
        match="The dataset contains no rows",
    ):
        validate_dataset(dataframe)


def test_zero_column_dataset():
    dataframe = pd.DataFrame(index=[0, 1])

    with pytest.raises(
        DatasetValidationError,
        match="The dataset contains no columns",
    ):
        validate_dataset(dataframe)
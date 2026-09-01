import pandas as pd
import pytest

from app.models.dataset import DatasetRecord
from app.services.dataset_registry import DatasetRegistry


def test_register_and_get_dataset():
    registry = DatasetRegistry()
    dataset = DatasetRecord(
        dataset_id="test-id",
        filename="test.csv",
        file_type="csv",
        rows=2,
        columns=3,
        column_names=["Name", "Age", "Salary"],
    )

    dataframe = pd.DataFrame(
        {
            "Name": ["Harsh", "Rahul"],
            "Age": [21, 22],
            "Salary": [45000, 50000],
        }
    )

    registry.register(dataset, dataframe)

    assert registry.exists("test-id")
    assert registry.get("test-id") == dataset

def test_working_copy_does_not_modify_original():
    registry = DatasetRegistry()

    dataset = DatasetRecord(
        dataset_id="immutable-test",
        filename="test.csv",
        file_type="csv",
        rows=2,
        columns=2,
        column_names=["Name", "Age"],
    )

    dataframe = pd.DataFrame(
        {
            "Name": ["Harsh", "Rahul"],
            "Age": [21, 22],
        }
    )

    registry.register(dataset, dataframe)

    working_copy = registry.get_working_copy("immutable-test")

    working_copy["Age"] = [99, 100]

    another_copy = registry.get_working_copy("immutable-test")

    assert another_copy["Age"].tolist() == [21, 22]
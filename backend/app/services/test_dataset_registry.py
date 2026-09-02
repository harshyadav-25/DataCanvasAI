import pandas as pd
import pytest
from app.exceptions.dataset import DatasetNotFoundError

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

def test_register_does_not_retain_original_dataframe_reference():
    registry = DatasetRegistry()

    dataset = DatasetRecord(
        dataset_id="reference-test",
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

    dataframe["Age"] = [99, 100]

    stored_copy = registry.get_working_copy("reference-test")

    assert stored_copy["Age"].tolist() == [21, 22]
def test_get_unknown_dataset_raises_dataset_not_found_error():
    registry = DatasetRegistry()

    with pytest.raises(DatasetNotFoundError):
        registry.get("unknown-id")


def test_delete_dataset_removes_metadata_and_dataframe():
    registry = DatasetRegistry()

    dataset = DatasetRecord(
        dataset_id="delete-test",
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

    assert registry.exists("delete-test")

    registry.delete("delete-test")

    assert not registry.exists("delete-test")

    with pytest.raises(DatasetNotFoundError):
        registry.get("delete-test")

    with pytest.raises(DatasetNotFoundError):
        registry.get_working_copy("delete-test")


def test_delete_unknown_dataset_raises_dataset_not_found_error():
    registry = DatasetRegistry()

    with pytest.raises(DatasetNotFoundError):
        registry.delete("unknown-id")
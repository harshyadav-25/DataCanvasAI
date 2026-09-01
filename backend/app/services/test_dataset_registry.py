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

    registry.register(dataset)

    assert registry.exists("test-id")
    assert registry.get("test-id") == dataset


def test_get_unknown_dataset():
    registry = DatasetRegistry()

    with pytest.raises(KeyError):
        registry.get("unknown-id")
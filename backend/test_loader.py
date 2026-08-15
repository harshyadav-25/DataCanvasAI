from pathlib import Path

import pytest

from app.services.dataset_loader import load_dataset


SAMPLE_DIR = Path("../datasets/sample")


def test_load_valid_csv():
    sample_file = SAMPLE_DIR / "test_dataset.csv"

    dataframe = load_dataset(
        file_content=sample_file.read_bytes(),
        filename=sample_file.name,
    )

    assert dataframe.shape == (5, 4)
    assert list(dataframe.columns) == [
        "Name",
        "Age",
        "Salary",
        "City",
    ]


def test_reject_unsupported_file_format():
    with pytest.raises(ValueError, match="Unsupported file format"):
        load_dataset(
            file_content=b"fake pdf content",
            filename="test_dataset.pdf",
        )


def test_reject_empty_dataset():
    empty_file = SAMPLE_DIR / "empty_dataset.csv"

    with pytest.raises(
        ValueError,
        match="The uploaded dataset is empty",
    ):
        load_dataset(
            file_content=empty_file.read_bytes(),
            filename=empty_file.name,
        )
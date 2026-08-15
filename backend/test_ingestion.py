from pathlib import Path

from app.services.dataset_loader import load_dataset
from app.services.dataset_validator import validate_dataset


def test_ingestion_pipeline():
    sample_file = Path("../datasets/sample/test_dataset.csv")

    file_content = sample_file.read_bytes()

    dataframe = load_dataset(
        file_content=file_content,
        filename=sample_file.name,
    )

    validate_dataset(dataframe)

    assert dataframe.shape == (5, 4)
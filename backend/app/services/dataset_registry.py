import pandas as pd

from app.models.dataset import DatasetRecord
from app.exceptions.dataset import DatasetNotFoundError


class DatasetRegistry:
    def __init__(self):
        self._datasets: dict[str, DatasetRecord] = {}
        self._dataframes: dict[str, pd.DataFrame] = {}

    def register(
        self,
        dataset: DatasetRecord,
        dataframe: pd.DataFrame,
    ) -> None:
        self._datasets[dataset.dataset_id] = dataset
        self._dataframes[dataset.dataset_id] = dataframe.copy(deep=True)

    def get(self, dataset_id: str) -> DatasetRecord:
        if dataset_id not in self._datasets:
            raise DatasetNotFoundError(
                f"Dataset '{dataset_id}' was not found."
            )

        return self._datasets[dataset_id]

    def get_working_copy(self, dataset_id: str) -> pd.DataFrame:
        if dataset_id not in self._dataframes:
            raise DatasetNotFoundError(
                f"Dataset '{dataset_id}' was not found."
            )

        return self._dataframes[dataset_id].copy(deep=True)

    def exists(self, dataset_id: str) -> bool:
        return dataset_id in self._datasets

    def delete(self, dataset_id: str) -> None:
        if dataset_id not in self._datasets:
            raise DatasetNotFoundError(
                f"Dataset '{dataset_id}' was not found."
            )

        del self._datasets[dataset_id]
        del self._dataframes[dataset_id]
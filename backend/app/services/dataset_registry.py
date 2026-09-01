from app.models.dataset import DatasetRecord


class DatasetRegistry:
    def __init__(self):
        self._datasets: dict[str, DatasetRecord] = {}

    def register(self, dataset: DatasetRecord) -> None:
        self._datasets[dataset.dataset_id] = dataset

    def get(self, dataset_id: str) -> DatasetRecord:
        return self._datasets[dataset_id]

    def exists(self, dataset_id: str) -> bool:
        return dataset_id in self._datasets
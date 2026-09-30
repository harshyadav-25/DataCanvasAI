import pandas as pd

from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.main import app
from app.models.dataset import DatasetRecord
from app.services.registry import dataset_registry


client = TestClient(app)

app.dependency_overrides[get_current_user] = lambda: {
    "id": "test-user",
    "name": "Test User",
    "email": "test@example.com",
}


def setup_dataset():
    dataframe = pd.DataFrame(
        {
            "feature_1": [
                1, 2, 3, 4, 5,
                6, 7, 8, 9, 10,
                11, 12, 13, 14, 15,
                16, 17, 18, 19, 20,
            ],
            "feature_2": [
                20, 19, 18, 17, 16,
                15, 14, 13, 12, 11,
                10, 9, 8, 7, 6,
                5, 4, 3, 2, 1,
            ],
            "target": [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
            ],
        }
    )

    dataset = DatasetRecord(
        dataset_id="experiment-test",
        filename="experiment.csv",
        file_type="csv",
        rows=len(dataframe),
        columns=len(dataframe.columns),
        column_names=list(dataframe.columns),
    )

    dataset_registry.register(dataset, dataframe)


def test_compare_experiments_api():
    from app.services import experiment_cache
    experiment_cache.clear_cache()

    setup_dataset()

    response = client.post(
        "/experiments/compare/experiment-test",
        params={
            "target_column": "target",
            "problem_type": "classification",
            "model_names": ["catboost", "xgboost"],
            "n_splits": 2,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["target_column"] == "target"
    assert data["problem_type"] == "classification"
    assert data["primary_metric"] == "f1"
    assert len(data["results"]) > 0


def test_compare_experiments_api_dataset_not_found():
    response = client.post(
        "/experiments/compare/nonexistent-dataset",
        params={
            "target_column": "target",
            "problem_type": "classification",
            "n_splits": 5,
        },
    )

    assert response.status_code == 404
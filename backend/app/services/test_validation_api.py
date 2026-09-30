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


def test_validation_api_classification():
    dataset_id = "validation-api-test"

    dataframe = pd.DataFrame(
        {
            "age": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            "income": [20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
            "target": [
                0,
                1,
                0,
                1,
                0,
                1,
                0,
                1,
                0,
                1,
            ],
        }
    )

    dataset = DatasetRecord(
        dataset_id=dataset_id,
        filename="validation.csv",
        file_type="csv",
        rows=len(dataframe),
        columns=len(dataframe.columns),
        column_names=dataframe.columns.tolist(),
    )

    dataset_registry.register(dataset, dataframe)

    response = client.post(
        f"/validation/analyze/{dataset_id}",
        params={
            "target_column": "target",
            "problem_type": "classification",
            "n_splits": 2,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["target_column"] == "target"
    assert data["problem_type"] == "classification"
    assert len(data["results"]) > 0

    for result in data["results"]:
        assert "model_name" in result
        assert "mean_metrics" in result
        assert "std_metrics" in result

def test_validation_api_selected_models():
    dataset_id = "validation-api-selected-models-test"

    dataframe = pd.DataFrame(
        {
            "age": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            "income": [20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
            "target": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        }
    )

    dataset = DatasetRecord(
        dataset_id=dataset_id,
        filename="validation-selected-models.csv",
        file_type="csv",
        rows=len(dataframe),
        columns=len(dataframe.columns),
        column_names=dataframe.columns.tolist(),
    )

    dataset_registry.register(dataset, dataframe)

    response = client.post(
        f"/validation/analyze/{dataset_id}",
        params=[
            ("target_column", "target"),
            ("problem_type", "classification"),
            ("model_names", "xgboost"),
            ("model_names", "logistic_regression"),
            ("n_splits", "2"),
        ],
    )

    assert response.status_code == 200

    data = response.json()

    returned_models = {
        result["model_name"]
        for result in data["results"]
    }

    assert returned_models == {
        "xgboost",
        "logistic_regression",
    }

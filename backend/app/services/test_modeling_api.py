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


def register_dataset(dataset_id, dataframe):
    dataset_registry.register(
        DatasetRecord(
            dataset_id=dataset_id,
            filename=f"{dataset_id}.csv",
            file_type="csv",
            rows=len(dataframe),
            columns=len(dataframe.columns),
            column_names=list(dataframe.columns),
        ),
        dataframe,
    )


def test_modeling_api_trains_selected_regression_model():
    dataset_id = "modeling-regression-test"
    dataframe = pd.DataFrame(
        {
            "feature": list(range(12)),
            "target": [value * 2 + 1 for value in range(12)],
        }
    )
    register_dataset(dataset_id, dataframe)

    response = client.post(
        f"/modeling/train/{dataset_id}",
        params={
            "target_column": "target",
            "problem_type": "regression",
            "model_name": "linear_regression",
            "n_splits": 3,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["dataset_id"] == dataset_id
    assert data["target_column"] == "target"
    assert data["problem_type"] == "regression"
    assert data["model_name"] == "linear_regression"
    assert data["evaluation_method"] == "cross_validation"
    assert data["n_splits"] == 3
    assert len(data["results"]) == 1
    result = data["results"][0]
    assert result["model_name"] == "linear_regression"
    assert len(result["fold_metrics"]) == 3
    assert set(result["mean_metrics"]) == {"mae", "rmse", "r2"}
    assert set(result["std_metrics"]) == {"mae", "rmse", "r2"}


def test_modeling_api_trains_selected_classification_model():
    dataset_id = "modeling-classification-test"
    dataframe = pd.DataFrame(
        {
            "feature": list(range(20)),
            "target": [0] * 10 + [1] * 10,
        }
    )
    register_dataset(dataset_id, dataframe)

    response = client.post(
        f"/modeling/train/{dataset_id}",
        params={
            "target_column": "target",
            "problem_type": "classification",
            "model_name": "logistic_regression",
            "n_splits": 2,
        },
    )

    assert response.status_code == 200
    result = response.json()["results"][0]
    assert result["model_name"] == "logistic_regression"
    assert set(result["mean_metrics"]) == {
        "accuracy",
        "balanced_accuracy",
        "precision",
        "recall",
        "f1",
        "roc_auc",
        "pr_auc",
    }


def test_modeling_api_rejects_model_not_available_for_problem_type():
    dataset_id = "modeling-invalid-model-test"
    dataframe = pd.DataFrame(
        {
            "feature": list(range(8)),
            "target": list(range(8)),
        }
    )
    register_dataset(dataset_id, dataframe)

    response = client.post(
        f"/modeling/train/{dataset_id}",
        params={
            "target_column": "target",
            "problem_type": "classification",
            "model_name": "linear_regression",
        },
    )

    assert response.status_code == 422

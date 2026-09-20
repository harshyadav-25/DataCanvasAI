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


def test_preprocessing_endpoint_with_valid_dataset():
    dataset_id = "preprocessing-test-dataset"

    dataframe = pd.DataFrame(
        {
            "CustomerID": [101, 102, 103],
            "Age": [20, None, 22],
            "City": ["Delhi", "Mumbai", "Delhi"],
            "target": [0, 1, 0],
        }
    )

    dataset = DatasetRecord(
        dataset_id=dataset_id,
        filename="test.csv",
        file_type="csv",
        rows=3,
        columns=4,
        column_names=["CustomerID", "Age", "City", "target"],
    )

    dataset_registry.register(dataset, dataframe)

    response = client.post(
        f"/preprocessing/analyze/{dataset_id}",
        params={"target_column": "target"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["dataset_id"] == dataset_id
    assert data["target_column"] == "target"
    assert "feature_names" in data
    assert "feature_groups" in data

    assert "Age" in data["feature_groups"]["numeric"]
    assert "City" in data["feature_groups"]["categorical"]
    assert "target" in data["feature_groups"]["excluded"]
    
def test_preprocessing_endpoint_with_invalid_dataset():
    response = client.post(
        "/preprocessing/analyze/non-existent-dataset",
        params={"target_column": "target"},
    )

    assert response.status_code == 404
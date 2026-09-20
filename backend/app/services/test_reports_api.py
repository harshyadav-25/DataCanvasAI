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


def test_reports_endpoint_with_valid_dataset():
    dataset_id = "report-test-dataset"

    dataframe = pd.DataFrame(
        {
            "age": [20, 21, 22, 23],
            "income": [30000, 35000, 40000, 45000],
            "target": [0, 1, 0, 1],
        }
    )

    dataset = DatasetRecord(
        dataset_id=dataset_id,
        filename="test.csv",
        file_type="csv",
        rows=4,
        columns=3,
        column_names=["age", "income", "target"],
    )

    dataset_registry.register(dataset, dataframe)

    response = client.post(
        f"/reports/generate/{dataset_id}",
        params={"target_column": "target"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["dataset_id"] == dataset_id
    assert "overall_readiness_score" in data
    assert "dimension_scores" in data
    assert "key_findings" in data
    assert "recommendations" in data

def test_reports_endpoint_with_invalid_dataset():
    response = client.post(
        "/reports/generate/non-existent-dataset",
        params={"target_column": "target"},
    )

    assert response.status_code == 404
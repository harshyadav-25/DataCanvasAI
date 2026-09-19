from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.services.registry import dataset_registry
from app.models.dataset import DatasetRecord

import pandas as pd

client = TestClient(app)


def mock_current_user():
    return {
        "id": "test-user-id",
        "name": "Test User",
        "email": "test@example.com",
    }


app.dependency_overrides[get_current_user] = mock_current_user


def test_analyze_dataset_risks():
    dataset_id = "risk-api-test"

    dataframe = pd.DataFrame(
        {
            "user_id": [1, 2, 3, 4, 5],
            "Age": [21, None, None, 24, 25],
            "Target": [0, 0, 0, 1, 1],
        }
    )

    dataset = DatasetRecord(
        dataset_id=dataset_id,
        filename="risk_test.csv",
        file_type="csv",
        rows=5,
        columns=3,
        column_names=["user_id", "Age", "Target"],
    )

    dataset_registry.register(dataset, dataframe)

    response = client.post(
        f"/risks/analyze/{dataset_id}",
        params={"target_column": "Target"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["dataset_id"] == dataset_id

    risk_types = [
        finding["risk_type"]
        for finding in data["findings"]
    ]

    assert "IDENTIFIER_LIKE_COLUMN" in risk_types
    assert "MISSING_VALUES" in risk_types

def test_analyze_dataset_risks_dataset_not_found():
    response = client.post(
        "/risks/analyze/non-existent-dataset",
    )

    assert response.status_code == 404

    data = response.json()

    assert "Dataset 'non-existent-dataset' was not found." in data["detail"]
import pandas as pd

from app.services.dataset_profiler import DatasetProfiler
from app.services.readiness_engine import build_readiness_score
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


def test_readiness_api_flow():
    dataframe = pd.DataFrame(
        {
            "age": [20, 21, 22, 23],
            "income": [30000, 35000, 40000, 45000],
            "target": [0, 1, 0, 1],
        }
    )

    profile = DatasetProfiler().profile(dataframe)

    result = build_readiness_score(
        dataframe=dataframe,
        profile=profile,
        target_column="target",
        leakage_findings=[],
    )

    assert result.overall_score == 100.0
    assert result.dimensions.data_quality == 100.0
    assert result.dimensions.target_quality == 100.0
    
def test_readiness_endpoint():
    response = client.post(
        "/readiness/analyze/test-dataset",
        params={"target_column": "target"},
    )

    assert response.status_code == 404
    
def test_readiness_endpoint_with_valid_dataset():
    dataset_id = "readiness-test-dataset"

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
        f"/readiness/analyze/{dataset_id}",
        params={"target_column": "target"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["overall_score"] == 100.0
    assert data["dimensions"]["data_quality"] == 100.0
    assert data["dimensions"]["target_quality"] == 100.0
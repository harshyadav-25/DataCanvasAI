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


def register_dataset(dataset_id: str, dataframe: pd.DataFrame) -> None:
    dataset_registry.register(
        DatasetRecord(
            dataset_id=dataset_id,
            filename="visualization.csv",
            file_type="csv",
            rows=len(dataframe),
            columns=len(dataframe.columns),
            column_names=list(dataframe.columns),
        ),
        dataframe,
    )


def test_visualization_api_returns_numeric_histogram_and_categorical_counts():
    dataset_id = "visualization-api-test"
    dataframe = pd.DataFrame(
        {
            "age": [20, 21, 21, 22],
            "city": ["A", "A", "B", None],
            "target": [100, 200, 300, 400],
        }
    )
    register_dataset(dataset_id, dataframe)

    response = client.post(
        f"/visualization/analyze/{dataset_id}",
        params={"target_column": "target"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["dataset_id"] == dataset_id
    assert data["target_column"] == "target"
    assert data["rows"] == 4
    assert data["columns"] == 3

    charts = {chart["column"]: chart for chart in data["charts"]}
    assert charts["age"]["chart_type"] == "histogram"
    assert sum(charts["age"]["values"]) == 4
    assert charts["age"]["x_axis_label"] == "age"
    assert charts["age"]["y_axis_label"] == "Row count"
    assert charts["age"]["numeric_summary"] == {
        "minimum": 20.0,
        "first_quartile": 20.75,
        "median": 21.0,
        "third_quartile": 21.25,
        "maximum": 22.0,
        "mean": 21.0,
    }

    assert charts["city"]["chart_type"] == "bar"
    assert charts["city"]["numeric_summary"] is None
    assert charts["city"]["labels"] == ["A", "B", "(Missing)"]
    assert charts["city"]["values"] == [2, 1, 1]
    assert charts["city"]["missing_count"] == 1


def test_visualization_api_rejects_unknown_target_column():
    dataset_id = "visualization-invalid-target"
    dataframe = pd.DataFrame({"value": [1, 2, 3]})
    register_dataset(dataset_id, dataframe)

    response = client.post(
        f"/visualization/analyze/{dataset_id}",
        params={"target_column": "missing"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "Target column 'missing' was not found in the dataset."
    )


def test_visualization_api_dataset_not_found():
    response = client.post(
        "/visualization/analyze/nonexistent-visualization-dataset",
    )

    assert response.status_code == 404

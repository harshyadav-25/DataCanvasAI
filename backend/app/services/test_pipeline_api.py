from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.main import app


client = TestClient(app)

app.dependency_overrides[get_current_user] = lambda: {
    "id": "test-user",
    "name": "Test User",
    "email": "test@example.com",
}


def test_generate_pipeline_api():
    response = client.post(
        "/pipeline/generate",
        json={
            "target_column": "target",
            "problem_type": "classification",
            "model_name": "logistic_regression",
            "identifier_columns": ["id"],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["target_column"] == "target"
    assert data["problem_type"] == "classification"
    assert data["model_name"] == "logistic_regression"

    assert "LogisticRegression" in data["code"]
    assert "ColumnTransformer" in data["code"]
    assert "OneHotEncoder" in data["code"]


def test_generate_pipeline_api_regression():
    response = client.post(
        "/pipeline/generate",
        json={
            "target_column": "price",
            "problem_type": "regression",
            "model_name": "ridge",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["problem_type"] == "regression"
    assert data["model_name"] == "ridge"
    assert "Ridge()" in data["code"]
    assert "r2_score" in data["code"]


def test_generate_pipeline_api_invalid_model():
    response = client.post(
        "/pipeline/generate",
        json={
            "target_column": "target",
            "problem_type": "classification",
            "model_name": "random_forest",
        },
    )
    assert response.status_code == 400
    assert "Unsupported model" in response.json()["detail"]

   
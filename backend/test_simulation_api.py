from fastapi.testclient import TestClient

from app.main import app
from app.services.registry import dataset_registry
from app.core.dependencies import get_current_user


client = TestClient(app)
app.dependency_overrides[get_current_user] = lambda: {
    "user_id": "test-user"
}


def test_run_simulation():
    dataset_id = "simulation-api-test"

    import pandas as pd

    dataframe = pd.DataFrame({
        "age": [20, None, 30],
    })

    dataset_registry.register(
        dataset=type(
            "Dataset",
            (),
            {"dataset_id": dataset_id},
        )(),
        dataframe=dataframe,
    )

    response = client.post(
        f"/simulation/run/{dataset_id}",
        json={
            "column": "age",
            "transformation": "MEDIAN_IMPUTATION",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["column"] == "age"
    assert data["transformation"] == "MEDIAN_IMPUTATION"
    assert data["missing_values_before"] == 1
    assert data["missing_values_after"] == 0
    assert data["rows_affected"] == 1
    assert data["changed"] is True
    
def test_run_simulation_dataset_not_found():
    response = client.post(
        "/simulation/run/non-existent-dataset",
        json={
            "column": "age",
            "transformation": "MEDIAN_IMPUTATION",
        },
    )

    assert response.status_code == 404

def test_run_simulation_invalid_transformation():
    dataset_id = "simulation-api-invalid"

    import pandas as pd

    dataframe = pd.DataFrame({
        "age": [20, None, 30],
    })

    dataset_registry.register(
        dataset=type(
            "Dataset",
            (),
            {"dataset_id": dataset_id},
        )(),
        dataframe=dataframe,
    )

    response = client.post(
        f"/simulation/run/{dataset_id}",
        json={
            "column": "age",
            "transformation": "INVALID_TRANSFORMATION",
        },
    )

    assert response.status_code == 422

def test_run_simulation_invalid_column():
    dataset_id = "simulation-api-invalid-column"

    import pandas as pd

    dataframe = pd.DataFrame({
        "age": [20, None, 30],
    })

    dataset_registry.register(
        dataset=type(
            "Dataset",
            (),
            {"dataset_id": dataset_id},
        )(),
        dataframe=dataframe,
    )

    response = client.post(
        f"/simulation/run/{dataset_id}",
        json={
            "column": "salary",
            "transformation": "MEDIAN_IMPUTATION",
        },
    )

    assert response.status_code == 400
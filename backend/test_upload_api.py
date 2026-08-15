from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_upload_valid_csv():
    with open("../datasets/sample/test_dataset.csv", "rb") as file:
        response = client.post(
            "/upload",
            files={
                "file": (
                    "test_dataset.csv",
                    file,
                    "text/csv"
                )
            }
        )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "test_dataset.csv"
    assert data["file_type"] == "csv"
    assert data["rows"] == 5
    assert data["columns"] == 4
    assert data["column_names"] == [
        "Name",
        "Age",
        "Salary",
        "City"
    ]
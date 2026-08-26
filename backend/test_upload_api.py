from fastapi.testclient import TestClient
import pandas as pd
import io
import pytest

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


def test_upload_file_too_large():
    large_content = b"x" * (25 * 1024 * 1024 + 1)

    response = client.post(
        "/upload",
        files={
            "file": (
                "large_dataset.csv",
                large_content,
                "text/csv"
            )
        }
    )

    assert response.status_code == 413

    data = response.json()

    assert data["error"]["code"] == "DATASET_TOO_LARGE"
    assert data["error"]["message"] == (
        "Uploaded file exceeds the maximum allowed size of 25 MB."
    )


def test_upload_unsupported_file_format():
    response = client.post(
        "/upload",
        files={
            "file": (
                "test_dataset.pdf",
                b"fake pdf content",
                "application/pdf"
            )
        }
    )

    assert response.status_code == 415

    data = response.json()

    assert data["error"]["code"] == "UNSUPPORTED_FILE_TYPE"
    assert "Unsupported file format" in data["error"]["message"]


def test_upload_dataset_with_duplicate_columns():
    csv_content = (
        "Name,Age,Age\n"
        "Harsh,21,45000\n"
        "Rahul,22,50000\n"
    ).encode()

    response = client.post(
        "/upload",
        files={
            "file": (
                "duplicate_columns.csv",
                csv_content,
                "text/csv"
            )
        }
    )

    assert response.status_code == 400

    data = response.json()

    assert data["error"]["code"] == "DATASET_VALIDATION_ERROR"
    assert "Duplicate column names found" in data["error"]["message"]

def test_upload_empty_dataset():
    response = client.post(
        "/upload",
        files={
            "file": (
                "empty_dataset.csv",
                b"",
                "text/csv"
            )
        }
    )

    assert response.status_code == 400

    data = response.json()

    assert data["error"]["code"] == "EMPTY_DATASET"
    assert "uploaded dataset is empty" in data["error"]["message"].lower()

def test_upload_malformed_csv():
    malformed_csv = (
        "Name,Age,Salary\n"
        '"Harsh,21,45000\n'
        "Rahul,22,50000\n"
    ).encode()

    response = client.post(
        "/upload",
        files={
            "file": (
                "malformed.csv",
                malformed_csv,
                "text/csv"
            )
        }
    )

    assert response.status_code == 400

    data = response.json()

    assert data["error"]["code"] == "DATASET_READ_ERROR"
    assert "Unable to read dataset" in data["error"]["message"]

def test_upload_valid_xlsx():
    import io
    import pandas as pd

    dataframe = pd.DataFrame(
        {
            "Name": ["Harsh", "Rahul"],
            "Age": [21, 22],
            "Salary": [45000, 50000],
        }
    )

    buffer = io.BytesIO()
    dataframe.to_excel(buffer, index=False)
    buffer.seek(0)

    response = client.post(
        "/upload",
        files={
            "file": (
                "test_dataset.xlsx",
                buffer.getvalue(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "test_dataset.xlsx"
    assert data["file_type"] == "xlsx"
    assert data["rows"] == 2
    assert data["columns"] == 3
    assert data["column_names"] == ["Name", "Age", "Salary"]

def test_upload_malformed_csv():
    csv_content = (
        "Name,Age,Salary\n"
        "Harsh,21,\"45000\n"
        "Rahul,22,50000\n"
    ).encode()

    response = client.post(
        "/upload",
        files={
            "file": (
                "malformed.csv",
                csv_content,
                "text/csv"
            )
        }
    )

    assert response.status_code == 400

    data = response.json()

    assert data["error"]["code"] == "DATASET_READ_ERROR"
    assert "Unable to read dataset" in data["error"]["message"]

def test_upload_zero_row_dataset():
    csv_content = (
        "Name,Age,Salary\n"
    ).encode()

    response = client.post(
        "/upload",
        files={
            "file": (
                "zero_row.csv",
                csv_content,
                "text/csv"
            )
        }
    )

    assert response.status_code == 400

    data = response.json()

    assert data["error"]["code"] == "EMPTY_DATASET"
    assert "uploaded dataset is empty" in data["error"]["message"].lower()

def test_upload_malformed_xlsx():
    response = client.post(
        "/upload",
        files={
            "file": (
                "malformed.xlsx",
                b"this is not a real xlsx file",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
        },
    )

    assert response.status_code == 400

    data = response.json()

    assert data["error"]["code"] == "DATASET_READ_ERROR"
    assert "Unable to read dataset" in data["error"]["message"]

def test_upload_dataset_with_unusual_filename():
    csv_content = (
        "Name,Age,Salary\n"
        "Harsh,21,45000\n"
        "Rahul,22,50000\n"
    ).encode()

    response = client.post(
        "/upload",
        files={
            "file": (
                "my dataset (final)-v2.csv",
                csv_content,
                "text/csv",
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "my dataset (final)-v2.csv"
    assert data["file_type"] == "csv"
    assert data["rows"] == 2
    assert data["columns"] == 3

def test_upload_utf8_dataset():
    csv_content = (
        "Name,City\n"
        "Harsh,Kanpur\n"
        "Rahul,??????\n"
    ).encode("utf-8")

    response = client.post(
        "/upload",
        files={
            "file": (
                "unicode_dataset.csv",
                csv_content,
                "text/csv",
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "unicode_dataset.csv"
    assert data["file_type"] == "csv"
    assert data["rows"] == 2
    assert data["columns"] == 2

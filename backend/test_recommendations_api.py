from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_generate_recommendations():
    payload = [
        {
            "risk_type": "MISSING_VALUES",
            "severity": "HIGH",
            "column": "Age",
            "title": "Missing values detected",
            "evidence": {
                "missing_count": 5,
            },
            "explanation": "The column contains missing values.",
            "confidence": 0.95,
        }
    ]

    response = client.post(
        "/recommendations/generate",
        json=payload,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["risk_type"] == "MISSING_VALUES"
    assert data[0]["priority"] == "HIGH"
    
def test_generate_recommendations_prioritizes_risks():
    payload = [
        {
            "risk_type": "MISSING_VALUES",
            "severity": "LOW",
            "column": "Age",
            "title": "Missing values detected",
            "evidence": {"missing_count": 2},
            "explanation": "The column contains missing values.",
            "confidence": 0.90,
        },
        {
            "risk_type": "SINGLE_CLASS_TARGET",
            "severity": "CRITICAL",
            "column": "Target",
            "title": "Single class target",
            "evidence": {"unique_classes": 1},
            "explanation": "The target contains only one class.",
            "confidence": 0.99,
        },
    ]

    response = client.post(
        "/recommendations/generate",
        json=payload,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
    assert data[0]["priority"] == "CRITICAL"
    assert data[1]["priority"] == "LOW"
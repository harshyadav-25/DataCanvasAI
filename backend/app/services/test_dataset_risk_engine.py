import pandas as pd
from app.services.target_analyzer import analyze_target

from app.schemas.risk import RiskSeverity
from app.services.dataset_risk_engine import (
    detect_class_imbalance,
    detect_identifier_like_columns,
    detect_missing_value_risk,
    detect_dataset_risks,
)


def test_detects_identifier_like_column():
    dataframe = pd.DataFrame(
        {
            "customer_id": ["C001", "C002", "C003", "C004", "C005"],
            "age": [21, 22, 23, 21, 24],
        }
    )

    findings = detect_identifier_like_columns(dataframe)

    assert len(findings) == 1
    assert findings[0].column == "customer_id"
    assert findings[0].risk_type == "IDENTIFIER_LIKE_COLUMN"


def test_does_not_flag_normal_low_cardinality_column():
    dataframe = pd.DataFrame(
        {
            "city": [
                "Delhi",
                "Delhi",
                "Kanpur",
                "Lucknow",
                "Delhi",
            ],
            "age": [21, 22, 23, 21, 24],
        }
    )

    findings = detect_identifier_like_columns(dataframe)

    assert findings == []


def test_does_not_flag_unique_numeric_feature_without_identifier_name():
    dataframe = pd.DataFrame(
        {
            "salary": [45000, 46000, 47000, 48000, 49000],
        }
    )

    findings = detect_identifier_like_columns(dataframe)

    assert findings == []


def test_detects_string_column_with_high_uniqueness():
    dataframe = pd.DataFrame(
        {
            "transaction_reference": [
                "TX1001",
                "TX1002",
                "TX1003",
                "TX1004",
                "TX1005",
            ],
        }
    )

    findings = detect_identifier_like_columns(dataframe)

    assert len(findings) == 1
    assert findings[0].column == "transaction_reference"


def test_empty_dataframe_returns_no_findings():
    dataframe = pd.DataFrame()

    findings = detect_identifier_like_columns(dataframe)

    assert findings == []

def test_balanced_target_has_no_imbalance_risk():
    dataframe = pd.DataFrame(
        {
            "target": [0, 0, 1, 1]
        }
    )

    findings = detect_class_imbalance(dataframe, "target")

    assert findings == []


def test_moderate_class_imbalance_is_detected():
    dataframe = pd.DataFrame(
        {
            "target": [0] * 85 + [1] * 15
        }
    )

    findings = detect_class_imbalance(dataframe, "target")

    assert len(findings) == 1
    assert findings[0].risk_type == "CLASS_IMBALANCE"
    assert findings[0].severity == RiskSeverity.MEDIUM


def test_severe_class_imbalance_is_high_risk():
    dataframe = pd.DataFrame(
        {
            "target": [0] * 95 + [1] * 5
        }
    )

    findings = detect_class_imbalance(dataframe, "target")

    assert len(findings) == 1
    assert findings[0].risk_type == "CLASS_IMBALANCE"
    assert findings[0].severity == RiskSeverity.HIGH


def test_multiclass_imbalance_is_detected():
    dataframe = pd.DataFrame(
        {
            "target": (
                ["A"] * 70
                + ["B"] * 20
                + ["C"] * 10
            )
        }
    )

    findings = detect_class_imbalance(dataframe, "target")

    assert len(findings) == 1
    assert findings[0].risk_type == "CLASS_IMBALANCE"


def test_single_class_target_is_critical():
    dataframe = pd.DataFrame(
        {
            "target": [1, 1, 1, 1, 1]
        }
    )

    findings = detect_class_imbalance(dataframe, "target")

    assert len(findings) == 1
    assert findings[0].risk_type == "SINGLE_CLASS_TARGET"
    assert findings[0].severity == RiskSeverity.CRITICAL


def test_missing_target_values_are_ignored():
    dataframe = pd.DataFrame(
        {
            "target": [0, 0, 0, 1, 1, None]
        }
    )

    findings = detect_class_imbalance(dataframe, "target")

    assert findings == []


def test_unknown_target_column_returns_no_findings():
    dataframe = pd.DataFrame(
        {
            "target": [0, 1, 0, 1]
        }
    )

    findings = detect_class_imbalance(dataframe, "missing")

    assert findings == []


def test_empty_dataframe_returns_no_findings():
    dataframe = pd.DataFrame()

    findings = detect_class_imbalance(dataframe, "target")

    assert findings == []
def test_low_missing_values_have_no_risk():
    dataframe = pd.DataFrame({
        "age": [21, 22, 23, 24, 25],
    })

    findings = detect_missing_value_risk(dataframe)

    assert findings == []


def test_moderate_missing_values_are_detected():
    dataframe = pd.DataFrame({
        "age": [21, 22, None, None, 25],
    })

    findings = detect_missing_value_risk(dataframe)

    assert len(findings) == 1
    assert findings[0].risk_type == "MISSING_VALUES"
    assert findings[0].severity == RiskSeverity.MEDIUM


def test_severe_missing_values_are_high_risk():
    dataframe = pd.DataFrame({
        "age": [21, None, None, None, None],
    })

    findings = detect_missing_value_risk(dataframe)

    assert len(findings) == 1
    assert findings[0].risk_type == "MISSING_VALUES"
    assert findings[0].severity == RiskSeverity.HIGH


def test_multiple_columns_with_missing_values_are_detected():
    dataframe = pd.DataFrame({
        "age": [21, None, None, 24, 25],
        "salary": [45000, None, None, None, 60000],
    })

    findings = detect_missing_value_risk(dataframe)

    assert len(findings) == 2


def test_empty_dataframe_returns_no_missing_value_findings():
    dataframe = pd.DataFrame()

    findings = detect_missing_value_risk(dataframe)

    assert findings == []

def test_detect_dataset_risks_combines_findings():
    dataframe = pd.DataFrame(
        {
            "user_id": [1, 2, 3, 4, 5],
            "Age": [21, None, None, 24, 25],
            "Target": [0, 0, 0, 1, 1],
        }
    )

    findings = detect_dataset_risks(
        dataframe,
        target_column="Target",
    )

    risk_types = [finding.risk_type for finding in findings]

    assert "IDENTIFIER_LIKE_COLUMN" in risk_types
    assert "MISSING_VALUES" in risk_types
    assert "CLASS_IMBALANCE" not in risk_types
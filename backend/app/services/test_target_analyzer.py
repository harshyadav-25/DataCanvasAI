import pandas as pd
import pytest

from app.schemas.target import TargetProblemType
from app.services.target_analyzer import analyze_target


def test_binary_numeric_target_is_classification():
    dataframe = pd.DataFrame({
        "age": [21, 22, 23, 24],
        "churn": [0, 1, 0, 1],
    })

    result = analyze_target(dataframe, "churn")

    assert result.target_column == "churn"
    assert result.problem_type == TargetProblemType.CLASSIFICATION
    assert result.class_count == 2


def test_string_target_is_classification():
    dataframe = pd.DataFrame({
        "name": ["A", "B", "C", "D"],
        "city": ["Delhi", "Kanpur", "Delhi", "Lucknow"],
    })

    result = analyze_target(dataframe, "city")

    assert result.problem_type == TargetProblemType.CLASSIFICATION
    assert result.class_count == 3


def test_boolean_target_is_classification():
    dataframe = pd.DataFrame({
        "approved": [True, False, True, False],
    })

    result = analyze_target(dataframe, "approved")

    assert result.problem_type == TargetProblemType.CLASSIFICATION
    assert result.class_count == 2


def test_numeric_target_with_few_unique_values_is_classification():
    dataframe = pd.DataFrame({
        "rating": [1, 2, 3, 1, 2, 3],
    })

    result = analyze_target(dataframe, "rating")

    assert result.problem_type == TargetProblemType.CLASSIFICATION
    assert result.class_count == 3


def test_continuous_numeric_target_is_regression():
    dataframe = pd.DataFrame({
        "salary": [45000, 52000, 61000, 73000, 85000, 91000],
    })

    result = analyze_target(dataframe, "salary")

    assert result.problem_type == TargetProblemType.REGRESSION
    assert result.class_count is None


def test_missing_target_column_raises_error():
    dataframe = pd.DataFrame({
        "age": [21, 22, 23],
    })

    with pytest.raises(ValueError):
        analyze_target(dataframe, "salary")


def test_empty_target_raises_error():
    dataframe = pd.DataFrame({
        "target": [None, None, None],
    })

    with pytest.raises(ValueError):
        analyze_target(dataframe, "target")
import pytest
import pandas as pd

from app.schemas.target import TargetProblemType
from app.services.experiment_engine import (
    compare_experiments,
    run_experiment_comparison,
    sort_experiment_results,
)



def test_compare_classification_experiments():
    validation_results = [
        {
            "model_name": "Logistic Regression",
            "mean_metrics": {
                "accuracy": 0.85,
                "precision": 0.84,
                "recall": 0.83,
                "f1": 0.835,
            },
            "std_metrics": {
                "accuracy": 0.02,
                "precision": 0.03,
                "recall": 0.02,
                "f1": 0.025,
            },
        },
        {
            "model_name": "Random Forest",
            "mean_metrics": {
                "accuracy": 0.90,
                "precision": 0.89,
                "recall": 0.88,
                "f1": 0.885,
            },
            "std_metrics": {
                "accuracy": 0.01,
                "precision": 0.02,
                "recall": 0.02,
                "f1": 0.015,
            },
        },
    ]

    comparison = compare_experiments(
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        validation_results=validation_results,
    )

    assert comparison.target_column == "target"
    assert comparison.problem_type == TargetProblemType.CLASSIFICATION
    assert comparison.primary_metric == "f1"
    assert len(comparison.results) == 2
    assert comparison.results[0].model_name == "Logistic Regression"


def test_compare_regression_experiments():
    validation_results = [
        {
            "model_name": "Linear Regression",
            "mean_metrics": {
                "r2": 0.72,
                "mae": 2.1,
                "rmse": 3.0,
            },
            "std_metrics": {
                "r2": 0.04,
                "mae": 0.2,
                "rmse": 0.3,
            },
        },
    ]

    comparison = compare_experiments(
        target_column="price",
        problem_type=TargetProblemType.REGRESSION,
        validation_results=validation_results,
    )

    assert comparison.problem_type == TargetProblemType.REGRESSION
    assert comparison.primary_metric == "r2"
    assert len(comparison.results) == 1
    assert comparison.results[0].mean_metrics["r2"] == 0.72


def test_compare_empty_results():
    comparison = compare_experiments(
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        validation_results=[],
    )

    assert comparison.results == []
    assert comparison.primary_metric == "f1"
    
def test_sort_classification_results_by_f1():
    validation_results = [
        {
            "model_name": "Model A",
            "mean_metrics": {"f1": 0.70},
            "std_metrics": {"f1": 0.03},
        },
        {
            "model_name": "Model B",
            "mean_metrics": {"f1": 0.90},
            "std_metrics": {"f1": 0.02},
        },
        {
            "model_name": "Model C",
            "mean_metrics": {"f1": 0.80},
            "std_metrics": {"f1": 0.01},
        },
    ]

    comparison = compare_experiments(
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        validation_results=validation_results,
    )

    sorted_comparison = sort_experiment_results(comparison)

    assert [
        result.model_name
        for result in sorted_comparison.results
    ] == ["Model B", "Model C", "Model A"]


def test_sort_regression_results_by_r2():
    validation_results = [
        {
            "model_name": "Model A",
            "mean_metrics": {"r2": 0.60},
            "std_metrics": {"r2": 0.05},
        },
        {
            "model_name": "Model B",
            "mean_metrics": {"r2": 0.85},
            "std_metrics": {"r2": 0.03},
        },
    ]

    comparison = compare_experiments(
        target_column="price",
        problem_type=TargetProblemType.REGRESSION,
        validation_results=validation_results,
    )

    sorted_comparison = sort_experiment_results(comparison)

    assert sorted_comparison.results[0].model_name == "Model B"
    assert sorted_comparison.results[1].model_name == "Model A"
    
def test_run_experiment_comparison_with_classification_dataset():
    dataframe = pd.DataFrame(
        {
            "feature_1": [
                1, 2, 3, 4, 5,
                6, 7, 8, 9, 10,
                11, 12, 13, 14, 15,
                16, 17, 18, 19, 20,
            ],
            "feature_2": [
                20, 19, 18, 17, 16,
                15, 14, 13, 12, 11,
                10, 9, 8, 7, 6,
                5, 4, 3, 2, 1,
            ],
            "target": [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
            ],
        }
    )

    # clear experiment cache so this test is not affected by other tests
    import app.services.experiment_cache as ec
    ec.clear_cache()

    comparison = run_experiment_comparison(
        dataframe=dataframe,
        dataset_id="engine-test-cls",
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        model_names=["catboost", "xgboost"],
        n_splits=5,
    )

    assert comparison.target_column == "target"
    assert comparison.problem_type == TargetProblemType.CLASSIFICATION
    assert comparison.primary_metric == "f1"
    assert len(comparison.results) > 0

    for result in comparison.results:
        assert result.model_name
        assert "f1" in result.mean_metrics
        assert "f1" in result.std_metrics
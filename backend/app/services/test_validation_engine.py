from app.schemas.target import TargetProblemType
from app.services.validation_engine import get_models
import app.services.validation_engine as validation_engine
from sklearn.model_selection import KFold, StratifiedKFold
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    f1_score,
    precision_score,
    recall_score,
)
import numpy as np
import pandas as pd

from sklearn.linear_model import LogisticRegression

from app.schemas.target import TargetProblemType
from app.services.validation_engine import (
    get_models,
    get_cv_strategy,
    get_metric_names,
    calculate_regression_metrics,
    calculate_classification_metrics,
    evaluate_model,
    cross_validate_models,
    get_safe_n_splits,
    cross_validate_with_preprocessing,
)
import pytest

def test_classification_model_factory_returns_expected_models():
    models = get_models(TargetProblemType.CLASSIFICATION)

    assert list(models.keys()) == [
        "catboost",
        "xgboost",
        "lightgbm",
        "hist_gradient_boosting",
        "logistic_regression",
    ]


def test_regression_model_factory_returns_expected_models():
    models = get_models(TargetProblemType.REGRESSION)

    assert list(models.keys()) == [
        "catboost",
        "xgboost",
        "lightgbm",
        "hist_gradient_boosting",
        "linear_regression",
        "ridge",
    ]


def test_classification_factory_returns_five_models():
    models = get_models(TargetProblemType.CLASSIFICATION)

    assert len(models) == 5


def test_regression_factory_returns_five_models():
    models = get_models(TargetProblemType.REGRESSION)

    assert len(models) == 6
    
def test_classification_cv_strategy():
    cv = get_cv_strategy(TargetProblemType.CLASSIFICATION)

    assert isinstance(cv, StratifiedKFold)
    assert cv.n_splits == 5
    assert cv.shuffle is True
    assert cv.random_state == 42


def test_regression_cv_strategy():
    cv = get_cv_strategy(TargetProblemType.REGRESSION)

    assert isinstance(cv, KFold)
    assert cv.n_splits == 5
    assert cv.shuffle is True
    assert cv.random_state == 42

def test_classification_metric_names():
    metrics = get_metric_names(TargetProblemType.CLASSIFICATION)

    assert metrics == [
        "accuracy",
        "balanced_accuracy",
        "precision",
        "recall",
        "f1",
        "roc_auc",
        "pr_auc",
    ]


def test_regression_metric_names():
    metrics = get_metric_names(TargetProblemType.REGRESSION)

    assert metrics == [
        "mae",
        "rmse",
        "r2",
    ]

def test_regression_metrics():
    y_true = [3, -0.5, 2, 7]
    y_pred = [2.5, 0.0, 2, 8]

    metrics = calculate_regression_metrics(y_true, y_pred)

    assert metrics["mae"] == pytest.approx(0.5)
    assert metrics["rmse"] == pytest.approx(0.612372)
    assert metrics["r2"] == pytest.approx(0.948608)

def test_binary_classification_metrics():
    y_true = [0, 1, 1, 0, 1]
    y_pred = [0, 1, 0, 0, 1]
    y_score = [0.1, 0.9, 0.4, 0.2, 0.8]

    metrics = calculate_classification_metrics(
        y_true,
        y_pred,
        y_score,
    )

    assert metrics["accuracy"] == pytest.approx(0.8)
    assert metrics["balanced_accuracy"] == pytest.approx(0.833333)
    assert metrics["precision"] == pytest.approx(0.866667)
    assert metrics["recall"] == pytest.approx(0.8)
    assert metrics["f1"] == pytest.approx(0.8)
    assert 0.0 <= metrics["roc_auc"] <= 1.0
    assert 0.0 <= metrics["pr_auc"] <= 1.0


def test_classification_metrics_without_scores():
    y_true = [0, 1, 1, 0]
    y_pred = [0, 1, 0, 0]

    metrics = calculate_classification_metrics(
        y_true,
        y_pred,
    )

    assert metrics["accuracy"] == pytest.approx(
        accuracy_score(y_true, y_pred)
    )

    assert metrics["balanced_accuracy"] == pytest.approx(
        balanced_accuracy_score(y_true, y_pred)
    )

    assert metrics["precision"] == pytest.approx(
        precision_score(
            y_true,
            y_pred,
            average="weighted",
            zero_division=0,
        )
    )

    assert metrics["recall"] == pytest.approx(
        recall_score(
            y_true,
            y_pred,
            average="weighted",
            zero_division=0,
        )
    )

    assert metrics["f1"] == pytest.approx(
        f1_score(
            y_true,
            y_pred,
            average="weighted",
            zero_division=0,
        )
    )

    assert np.isnan(metrics["roc_auc"])
    assert np.isnan(metrics["pr_auc"])
def test_classification_metrics_with_single_class():
    y_true = [0, 0, 0, 0]
    y_pred = [0, 0, 0, 0]
    y_score = [0.1, 0.2, 0.3, 0.4]

    metrics = calculate_classification_metrics(
        y_true,
        y_pred,
        y_score,
    )

    assert np.isnan(metrics["roc_auc"])
    assert np.isnan(metrics["pr_auc"])

def test_evaluate_classification_model():
    X_train = [
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
    ]
    y_train = [0, 0, 0, 1, 1, 1]

    X_test = [
        [6],
        [7],
        [8],
        [9],
    ]
    y_test = [1, 1, 1, 1]

    model = LogisticRegression()

    metrics = evaluate_model(
        model,
        X_train,
        X_test,
        y_train,
        y_test,
        TargetProblemType.CLASSIFICATION,
    )

    assert isinstance(metrics, dict)

    assert "accuracy" in metrics
    assert "balanced_accuracy" in metrics
    assert "precision" in metrics
    assert "recall" in metrics
    assert "f1" in metrics
    assert "roc_auc" in metrics
    assert "pr_auc" in metrics

    assert 0.0 <= metrics["accuracy"] <= 1.0
    assert 0.0 <= metrics["f1"] <= 1.0

def test_evaluate_regression_model():
    X_train = [
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
    ]

    y_train = [2, 4, 6, 8, 10, 12]

    X_test = [
        [7],
        [8],
        [9],
        [10],
    ]

    y_test = [14, 16, 18, 20]

    from sklearn.linear_model import LinearRegression

    model = LinearRegression()

    metrics = evaluate_model(
        model,
        X_train,
        X_test,
        y_train,
        y_test,
        TargetProblemType.REGRESSION,
    )

    assert isinstance(metrics, dict)

    assert "mae" in metrics
    assert "rmse" in metrics
    assert "r2" in metrics

    assert metrics["mae"] == pytest.approx(0.0)
    assert metrics["rmse"] == pytest.approx(0.0)
    assert metrics["r2"] == pytest.approx(1.0)
    
    def test_cross_validate_models():
        X = np.array([
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
            [7],
            [8],
            [9],
            [10],
        ])
        y = np.array([
            2,
            4,
            6,
            8,
            10,
            12,
            14,
            16,
            18,
            20,
        ])
        results = cross_validate_models(
            X,
            y,
            TargetProblemType.REGRESSION,
            n_splits=5,
        )
        assert isinstance(results, dict)
        assert len(results) == 6
        for model_name, result in results.items():
            assert "model_name" in result
            assert "fold_metrics" in result
            assert "mean_metrics" in result
            assert "std_metrics" in result
            assert result["model_name"] == model_name
            assert len(result["fold_metrics"]) == 5
            assert isinstance(result["mean_metrics"], dict)
            assert isinstance(result["std_metrics"], dict)
            assert "mae" in result["mean_metrics"]
            assert "rmse" in result["mean_metrics"]
            assert "r2" in result["mean_metrics"]
            
def test_cross_validate_classification_models():
    X = np.array([
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [9],
        [10],
        [11],
        [12],
    ])

    y = np.array([
        0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1,
    ])

    results = cross_validate_models(
        X,
        y,
        TargetProblemType.CLASSIFICATION,
        n_splits=3,
    )

    assert isinstance(results, dict)
    assert len(results) == 5

    for model_name, result in results.items():
        assert result["model_name"] == model_name
        assert len(result["fold_metrics"]) == 3

        assert "mean_metrics" in result
        assert "std_metrics" in result

        assert "accuracy" in result["mean_metrics"]
        assert "f1" in result["mean_metrics"]
        assert "roc_auc" in result["mean_metrics"]
    
def test_get_safe_n_splits_classification():
    y = np.array([
        0, 0, 0,
        1, 1, 1,
    ])

    safe_splits = get_safe_n_splits(
        y,
        TargetProblemType.CLASSIFICATION,
        requested_splits=5,
    )

    assert safe_splits == 3


def test_get_safe_n_splits_classification_with_enough_samples():
    y = np.array([
        0, 0, 0, 0, 0,
        1, 1, 1, 1, 1,
    ])

    safe_splits = get_safe_n_splits(
        y,
        TargetProblemType.CLASSIFICATION,
        requested_splits=5,
    )

    assert safe_splits == 5


def test_get_safe_n_splits_regression():
    y = np.arange(20)

    safe_splits = get_safe_n_splits(
        y,
        TargetProblemType.REGRESSION,
        requested_splits=5,
    )

    assert safe_splits == 5


def test_get_safe_n_splits_regression_small_dataset():
    y = np.arange(3)

    safe_splits = get_safe_n_splits(
        y,
        TargetProblemType.REGRESSION,
        requested_splits=5,
    )

    assert safe_splits == 3
    
def test_cross_validate_with_preprocessing_classification():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 25, 30, 35, 40, 45, 50, 55],
            "City": [
                "Delhi",
                "Mumbai",
                "Delhi",
                "Pune",
                "Mumbai",
                "Delhi",
                "Pune",
                "Mumbai",
            ],
            "Target": [0, 1, 0, 1, 0, 1, 0, 1],
        }
    )

    results = cross_validate_with_preprocessing(
        dataframe=dataframe,
        target_column="Target",
        problem_type=TargetProblemType.CLASSIFICATION,
        n_splits=2,
    )

    assert results
    assert "logistic_regression" in results

    for model_result in results.values():
        assert len(model_result["fold_metrics"]) == 2
        assert "mean_metrics" in model_result
        assert "std_metrics" in model_result
        
def test_cross_validate_with_preprocessing_fits_on_train_only(monkeypatch):
    dataframe = pd.DataFrame(
        {
            "Age": [20, 25, 30, 35, 40, 45, 50, 55],
            "City": [
                "Delhi",
                "Mumbai",
                "Delhi",
                "Pune",
                "Mumbai",
                "Delhi",
                "Pune",
                "Mumbai",
            ],
            "Target": [0, 1, 0, 1, 0, 1, 0, 1],
        }
    )

original_engine = validation_engine.PreprocessingEngine

class SpyPreprocessingEngine(original_engine):
    def fit_transform(self, dataframe):
        self.fit_indices = set(dataframe.index)
        self.training_transform = True
        return super().fit_transform(dataframe)

    def transform(self, dataframe):
        transform_indices = set(dataframe.index)

        if not getattr(self, "training_transform", False):
            assert self.fit_indices.isdisjoint(transform_indices)

        self.training_transform = False

        return super().transform(dataframe)
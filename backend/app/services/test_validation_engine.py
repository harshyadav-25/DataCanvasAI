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
import inspect
import warnings

import numpy as np
import pandas as pd

from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.base import clone as sklearn_clone
from sklearn.exceptions import ConvergenceWarning

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
    prepare_estimator,
    standard_scale_steps,
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


def test_prepare_estimator_without_extra_steps_returns_estimator():
    estimator = LogisticRegression(max_iter=1000, random_state=42)

    assert prepare_estimator(estimator) is estimator
    assert prepare_estimator(estimator, extra_steps=()) is estimator


def test_prepare_estimator_wraps_extra_steps_in_pipeline():
    estimator = LogisticRegression(max_iter=1000, random_state=42)
    prepared = prepare_estimator(
        estimator,
        extra_steps=standard_scale_steps(),
    )

    assert isinstance(prepared, Pipeline)
    assert list(prepared.named_steps) == ["scaler", "model"]
    assert isinstance(prepared.named_steps["scaler"], StandardScaler)
    assert prepared.named_steps["model"] is estimator


def test_linear_models_use_standard_scaling_pipelines():
    classification_models = get_models(TargetProblemType.CLASSIFICATION)
    regression_models = get_models(TargetProblemType.REGRESSION)

    logistic = classification_models["logistic_regression"]
    linear = regression_models["linear_regression"]
    ridge = regression_models["ridge"]

    for prepared in (logistic, linear, ridge):
        assert isinstance(prepared, Pipeline)
        assert isinstance(prepared.named_steps["scaler"], StandardScaler)

    assert isinstance(
        logistic.named_steps["model"],
        LogisticRegression,
    )
    assert logistic.named_steps["model"].max_iter == 1000
    assert isinstance(linear.named_steps["model"], LinearRegression)
    assert isinstance(ridge.named_steps["model"], Ridge)


def test_tree_models_are_not_scaled():
    classification_models = get_models(TargetProblemType.CLASSIFICATION)
    regression_models = get_models(TargetProblemType.REGRESSION)

    for model_name in (
        "catboost",
        "xgboost",
        "lightgbm",
        "hist_gradient_boosting",
    ):
        assert not isinstance(classification_models[model_name], Pipeline)
        assert not isinstance(regression_models[model_name], Pipeline)


def test_prepared_estimators_do_not_share_scaler_instances():
    models = get_models(TargetProblemType.REGRESSION)

    linear_scaler = models["linear_regression"].named_steps["scaler"]
    ridge_scaler = models["ridge"].named_steps["scaler"]

    assert linear_scaler is not ridge_scaler


def test_linear_model_scaler_is_fitted_on_train_only():
    X_train = np.array(
        [
            [0.0, 10.0],
            [10.0, 20.0],
            [20.0, 30.0],
            [30.0, 40.0],
        ],
        dtype=float,
    )
    y_train = np.array([0, 0, 1, 1])
    X_test = np.array(
        [
            [1000.0, 5000.0],
            [2000.0, 8000.0],
        ],
        dtype=float,
    )

    model = sklearn_clone(
        get_models(TargetProblemType.CLASSIFICATION)["logistic_regression"]
    )
    model.fit(X_train, y_train)
    model.predict(X_test)

    scaler = model.named_steps["scaler"]
    assert scaler.mean_ == pytest.approx(X_train.mean(axis=0))
    assert scaler.scale_ == pytest.approx(X_train.std(axis=0, ddof=0))


def test_logistic_regression_converges_on_heterogeneous_feature_scales():
    rng = np.random.default_rng(42)
    n_samples = 240
    X = np.column_stack(
        [
            rng.normal(0.0, 1.0, n_samples),
            rng.normal(0.0, 1000.0, n_samples),
            rng.normal(250.0, 40.0, n_samples),
        ]
    )
    y = (X[:, 0] + (X[:, 1] / 1000.0) > 0.15).astype(int)

    model = sklearn_clone(
        get_models(TargetProblemType.CLASSIFICATION)["logistic_regression"]
    )

    with warnings.catch_warnings():
        warnings.simplefilter("error", ConvergenceWarning)
        model.fit(X, y)

    assert hasattr(model, "predict")
    predictions = model.predict(X)
    assert predictions.shape == (n_samples,)


def test_evaluate_model_does_not_branch_on_model_names():
    source = inspect.getsource(evaluate_model)

    assert "logistic_regression" not in source
    assert "linear_regression" not in source
    assert "lightgbm" not in source
    assert "if model_name" not in source


def test_fold_first_cv_keeps_metrics_for_scaled_logistic_regression():
    dataframe = pd.DataFrame(
        {
            "small": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
            "large": [1000, 2000, 1500, 2500, 1800, 2200, 1700, 2100],
            "Target": [0, 1, 0, 1, 0, 1, 0, 1],
        }
    )

    results = cross_validate_with_preprocessing(
        dataframe=dataframe,
        target_column="Target",
        problem_type=TargetProblemType.CLASSIFICATION,
        n_splits=2,
        model_names=["logistic_regression", "lightgbm"],
    )

    assert set(results) == {"logistic_regression", "lightgbm"}

    for result in results.values():
        assert len(result["fold_metrics"]) == 2
        assert "accuracy" in result["mean_metrics"]
        assert "accuracy" in result["std_metrics"]
        assert "f1" in result["mean_metrics"]
        for fold in result["fold_metrics"]:
            assert "accuracy" in fold
            assert "f1" in fold
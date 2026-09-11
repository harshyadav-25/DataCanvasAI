from app.schemas.target import TargetProblemType
from app.services.validation_engine import get_models


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
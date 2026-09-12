import numpy as np

from sklearn.ensemble import (
    HistGradientBoostingClassifier,
    HistGradientBoostingRegressor,
)
from sklearn.linear_model import (
    LinearRegression,
    LogisticRegression,
    Ridge,
)
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    balanced_accuracy_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import KFold, StratifiedKFold

from catboost import CatBoostClassifier, CatBoostRegressor
from lightgbm import LGBMClassifier, LGBMRegressor
from xgboost import XGBClassifier, XGBRegressor

from app.schemas.target import TargetProblemType


def get_models(problem_type: TargetProblemType) -> dict:
    if problem_type == TargetProblemType.CLASSIFICATION:
        return {
            "catboost": CatBoostClassifier(
                verbose=False,
                random_seed=42,
            ),
            "xgboost": XGBClassifier(
                random_state=42,
                eval_metric="logloss",
            ),
            "lightgbm": LGBMClassifier(
                random_state=42,
                verbosity=-1,
            ),
            "hist_gradient_boosting": HistGradientBoostingClassifier(
                random_state=42,
            ),
            "logistic_regression": LogisticRegression(
                max_iter=1000,
                random_state=42,
            ),
        }

    if problem_type == TargetProblemType.REGRESSION:
        return {
            "catboost": CatBoostRegressor(
                verbose=False,
                random_seed=42,
            ),
            "xgboost": XGBRegressor(
                random_state=42,
            ),
            "lightgbm": LGBMRegressor(
                random_state=42,
                verbosity=-1,
            ),
            "hist_gradient_boosting": HistGradientBoostingRegressor(
                random_state=42,
            ),
            "linear_regression": LinearRegression(),
            "ridge": Ridge(),
        }

    raise ValueError(f"Unsupported problem type: {problem_type}")


def get_cv_strategy(
    problem_type: TargetProblemType,
    n_splits: int = 5,
):
    if problem_type == TargetProblemType.CLASSIFICATION:
        return StratifiedKFold(
            n_splits=n_splits,
            shuffle=True,
            random_state=42,
        )

    if problem_type == TargetProblemType.REGRESSION:
        return KFold(
            n_splits=n_splits,
            shuffle=True,
            random_state=42,
        )

    raise ValueError(f"Unsupported problem type: {problem_type}")


def get_metric_names(
    problem_type: TargetProblemType,
) -> list[str]:
    if problem_type == TargetProblemType.CLASSIFICATION:
        return [
            "accuracy",
            "balanced_accuracy",
            "precision",
            "recall",
            "f1",
            "roc_auc",
            "pr_auc",
        ]

    if problem_type == TargetProblemType.REGRESSION:
        return [
            "mae",
            "rmse",
            "r2",
        ]

    raise ValueError(f"Unsupported problem type: {problem_type}")


def calculate_regression_metrics(
    y_true,
    y_pred,
) -> dict[str, float]:
    return {
        "mae": float(
            mean_absolute_error(y_true, y_pred)
        ),
        "rmse": float(
            np.sqrt(
                mean_squared_error(y_true, y_pred)
            )
        ),
        "r2": float(
            r2_score(y_true, y_pred)
        ),
    }


def calculate_classification_metrics(
    y_true,
    y_pred,
    y_score=None,
) -> dict[str, float]:
    metrics = {
        "accuracy": float(
            accuracy_score(y_true, y_pred)
        ),
        "balanced_accuracy": float(
            balanced_accuracy_score(y_true, y_pred)
        ),
        "precision": float(
            precision_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0,
            )
        ),
        "recall": float(
            recall_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0,
            )
        ),
        "f1": float(
            f1_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0,
            )
        ),
    }

    if y_score is not None:
        try:
            metrics["roc_auc"] = float(
                roc_auc_score(
                    y_true,
                    y_score,
                    multi_class="ovr",
                )
            )
        except ValueError:
            metrics["roc_auc"] = float("nan")

        try:
            metrics["pr_auc"] = float(
                average_precision_score(
                    y_true,
                    y_score,
                )
            )
        except ValueError:
            metrics["pr_auc"] = float("nan")
    else:
        metrics["roc_auc"] = float("nan")
        metrics["pr_auc"] = float("nan")

    return metrics


def evaluate_model(
    model,
    X_train,
    X_test,
    y_train,
    y_test,
    problem_type: TargetProblemType,
) -> dict[str, float]:
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    if problem_type == TargetProblemType.CLASSIFICATION:
        y_score = None

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(X_test)

            if probabilities.shape[1] == 2:
                y_score = probabilities[:, 1]
            else:
                y_score = probabilities

        return calculate_classification_metrics(
            y_test,
            y_pred,
            y_score,
        )

    if problem_type == TargetProblemType.REGRESSION:
        return calculate_regression_metrics(
            y_test,
            y_pred,
        )

    raise ValueError(f"Unsupported problem type: {problem_type}")

def cross_validate_models(
    X,
    y,
    problem_type: TargetProblemType,
    n_splits: int = 5,
) -> dict:
    models = get_models(problem_type)
    cv = get_cv_strategy(problem_type, n_splits)

    results = {}

    for model_name, model in models.items():
        fold_metrics = []

        for train_indices, test_indices in cv.split(X, y):
            X_train = X[train_indices]
            X_test = X[test_indices]

            y_train = y[train_indices]
            y_test = y[test_indices]

            metrics = evaluate_model(
                model,
                X_train,
                X_test,
                y_train,
                y_test,
                problem_type,
            )

            fold_metrics.append(metrics)

        metric_names = get_metric_names(problem_type)

        mean_metrics = {}
        std_metrics = {}

        for metric_name in metric_names:
            values = [
                metrics[metric_name]
                for metrics in fold_metrics
                if not np.isnan(metrics[metric_name])
            ]

            if values:
                mean_metrics[metric_name] = float(np.mean(values))
                std_metrics[metric_name] = float(np.std(values))
            else:
                mean_metrics[metric_name] = float("nan")
                std_metrics[metric_name] = float("nan")

        results[model_name] = {
            "model_name": model_name,
            "fold_metrics": fold_metrics,
            "mean_metrics": mean_metrics,
            "std_metrics": std_metrics,
        }

    return results
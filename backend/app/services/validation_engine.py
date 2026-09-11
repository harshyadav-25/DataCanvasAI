from sklearn.ensemble import HistGradientBoostingClassifier, HistGradientBoostingRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge

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
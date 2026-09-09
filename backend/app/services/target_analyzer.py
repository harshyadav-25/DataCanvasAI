import pandas as pd

from app.schemas.target import TargetAnalysis, TargetProblemType


def analyze_target(
    dataframe: pd.DataFrame,
    target_column: str,
) -> TargetAnalysis:
    if target_column not in dataframe.columns:
        raise ValueError(
            f"Target column '{target_column}' does not exist."
        )

    target = dataframe[target_column].dropna()

    if target.empty:
        raise ValueError(
            f"Target column '{target_column}' contains no valid values."
        )

    if (
        pd.api.types.is_object_dtype(target)
        or pd.api.types.is_string_dtype(target)
        or pd.api.types.is_bool_dtype(target)
        or (
            pd.api.types.is_integer_dtype(target)
            and target.nunique() <= 10
            and target.min() >= 0
            and target.max() <= 10
        )
    ):
        return TargetAnalysis(
            target_column=target_column,
            problem_type=TargetProblemType.CLASSIFICATION,
            class_count=int(target.nunique()),
        )

    return TargetAnalysis(
        target_column=target_column,
        problem_type=TargetProblemType.REGRESSION,
        class_count=None,
    )
from __future__ import annotations


import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
class DatetimeFeatures(BaseEstimator, TransformerMixin):
    """
    Convert datetime columns into numeric calendar features.
    """

    def fit(self, X, y=None):
        self.feature_names_in_ = list(X.columns)
        return self

    def transform(self, X):
        result = pd.DataFrame(index=X.index)

        for column in X.columns:
            values = pd.to_datetime(X[column], errors="coerce")

            result[f"{column}__year"] = values.dt.year
            result[f"{column}__month"] = values.dt.month
            result[f"{column}__day"] = values.dt.day
            result[f"{column}__day_of_week"] = values.dt.dayofweek

        return result

    def get_feature_names_out(self, input_features=None):
        if input_features is None:
            input_features = self.feature_names_in_

        feature_names = []

        for column in input_features:
            feature_names.extend(
                [
                    f"{column}__year",
                    f"{column}__month",
                    f"{column}__day",
                    f"{column}__day_of_week",
                ]
            )

        return feature_names


class PreprocessingEngine:
    """
    Builds a leakage-safe preprocessing pipeline for ML features.

    Responsibilities:
    - Exclude target column from features.
    - Exclude identifier-like columns.
    - Impute missing numeric values using the median.
    - Impute missing categorical values using the most frequent value.
    - One-hot encode categorical features.
    - Fit preprocessing only on the supplied training data.
    """

    def __init__(
        self,
        target_column: str,
        identifier_columns: list[str] | None = None,
    ) -> None:
        self.target_column = target_column
        self.identifier_columns = identifier_columns or []

        self.pipeline: ColumnTransformer | None = None

        self.numeric_columns: list[str] = []
        self.categorical_columns: list[str] = []
        self.datetime_columns: list[str] = []

    def fit(self, dataframe: pd.DataFrame) -> "PreprocessingEngine":
        """
        Fit preprocessing using training data only.
        """

        self._validate_input(dataframe)

        feature_columns = [
            column
            for column in dataframe.columns
            if column != self.target_column
            and column not in self.identifier_columns
        ]

        if not feature_columns:
            raise ValueError(
                "No usable feature columns remain after excluding "
                "the target and identifier columns."
            )

        features = dataframe[feature_columns]

        self.numeric_columns = (
            features
            .select_dtypes(include=["number"])
            .columns
            .tolist()
        )
        self.datetime_columns = (
            features
            .select_dtypes(include=["datetime", "datetimetz"])
            .columns
            .tolist()
        )

        self.categorical_columns = [
            column
            for column in features.columns
            if column not in self.numeric_columns
            and column not in self.datetime_columns
        ]

        self._validate_all_missing_columns(features)

        transformers = []

        if self.numeric_columns:
            numeric_pipeline = Pipeline(
                steps=[
                    (
                        "imputer",
                        SimpleImputer(strategy="median"),
                    )
                ]
            )

            transformers.append(
                (
                    "numeric",
                    numeric_pipeline,
                    self.numeric_columns,
                )
            )

        if self.categorical_columns:
            categorical_pipeline = Pipeline(
                steps=[
                    (
                        "imputer",
                        SimpleImputer(strategy="most_frequent"),
                    ),
                    (
                        "encoder",
                        OneHotEncoder(
                            handle_unknown="ignore",
                            sparse_output=False,
                        ),
                    ),
                ]
            )

            transformers.append(
                (
                    "categorical",
                    categorical_pipeline,
                    self.categorical_columns,
                )
            )
        if self.datetime_columns:
            datetime_pipeline = Pipeline(
                steps=[
                    (
                        "features",
                        DatetimeFeatures(),
                    ),
                    (
                        "imputer",
                        SimpleImputer(strategy="median"),
                    ),
                ]
            )

            transformers.append(
                (
                    "datetime",
                    datetime_pipeline,
                    self.datetime_columns,
                )
            )
        self.pipeline = ColumnTransformer(
            transformers=transformers,
            remainder="drop",
        )

        # Critical:
        # fit() learns imputation/encoding parameters ONLY
        # from the dataframe supplied here.
        self.pipeline.fit(features)

        return self

    def transform(self, dataframe: pd.DataFrame):
        """
        Transform data using parameters learned during fit().
        """

        if self.pipeline is None:
            raise RuntimeError(
                "PreprocessingEngine must be fitted before transform()."
            )

        self._validate_input(dataframe)

        feature_columns = [
            column
            for column in dataframe.columns
            if column != self.target_column
            and column not in self.identifier_columns
        ]

        features = dataframe[feature_columns]

        expected_columns = (
            self.numeric_columns
            + self.categorical_columns
            + self.datetime_columns
        )

        missing_columns = [
            column
            for column in expected_columns
            if column not in features.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing feature columns during transform: "
                f"{missing_columns}"
            )

        # Keep exactly the same feature order used during fitting.
        features = features[expected_columns]

        return self.pipeline.transform(features)

    def fit_transform(self, dataframe: pd.DataFrame):
        """
        Fit preprocessing and transform the same training dataset.
        """

        self.fit(dataframe)

        return self.transform(dataframe)

    def get_feature_names(self) -> list[str]:
        """
        Return names of the transformed features.
        """

        if self.pipeline is None:
            raise RuntimeError(
                "PreprocessingEngine must be fitted before "
                "getting feature names."
            )

        return self.pipeline.get_feature_names_out().tolist()
    def get_feature_groups(self) -> dict[str, list[str]]:
        """
        Return the feature groups identified during preprocessing.
        """

        if self.pipeline is None:
            raise RuntimeError(
                "PreprocessingEngine must be fitted before "
                "getting feature groups."
            )

        excluded_columns = [
            self.target_column,
            *self.identifier_columns,
        ]

        return {
            "numeric": self.numeric_columns.copy(),
            "categorical": self.categorical_columns.copy(),
            "datetime": self.datetime_columns.copy(),
            "excluded": excluded_columns,
        }

    def _validate_input(self, dataframe: pd.DataFrame) -> None:
        if not isinstance(dataframe, pd.DataFrame):
            raise TypeError("Input must be a pandas DataFrame.")

        if dataframe.empty:
            raise ValueError("Input dataset is empty.")

        if self.target_column not in dataframe.columns:
            raise ValueError(
                f"Target column '{self.target_column}' "
                "was not found in the dataset."
            )

        missing_identifiers = [
            column
            for column in self.identifier_columns
            if column not in dataframe.columns
        ]

        if missing_identifiers:
            raise ValueError(
                "Identifier columns not found in the dataset: "
                f"{missing_identifiers}"
            )

    def _validate_all_missing_columns(
        self,
        features: pd.DataFrame,
    ) -> None:
        all_missing = [
            column
            for column in features.columns
            if features[column].isna().all()
        ]

        if all_missing:
            raise ValueError(
                f"Columns contain no valid values: {all_missing}"
            )


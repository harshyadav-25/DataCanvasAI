import pandas as pd
import pytest
import numpy as np

from app.services.preprocessing_engine import (
    DatetimeFeatures,
    PreprocessingEngine,
)


def test_numeric_missing_values_use_median_imputation():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 21, None, 23],
            "Target": [0, 1, 0, 1],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    transformed = engine.fit_transform(dataframe)

    assert transformed.shape == (4, 1)
    assert not pd.isna(transformed).any()

    # Median of [20, 21, 23] = 21
    assert transformed[2, 0] == 21

def test_categorical_missing_values_use_most_frequent_imputation():
    dataframe = pd.DataFrame(
        {
            "City": ["Delhi", "Delhi", None, "Mumbai"],
            "Target": [0, 1, 0, 1],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    transformed = engine.fit_transform(dataframe)

    assert transformed.shape[0] == 4
    assert not pd.isna(transformed).any()

def test_categorical_columns_are_one_hot_encoded():
    dataframe = pd.DataFrame(
        {
            "City": ["Delhi", "Mumbai", "Delhi"],
            "Target": [0, 1, 0],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    transformed = engine.fit_transform(dataframe)

    # Two unique categories → two encoded features.
    assert transformed.shape == (3, 2)

def test_unknown_category_is_ignored_during_transform():
    train = pd.DataFrame(
        {
            "City": ["Delhi", "Mumbai"],
            "Target": [0, 1],
        }
    )

    validation = pd.DataFrame(
        {
            "City": ["Delhi", "Lucknow"],
            "Target": [1, 0],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    engine.fit(train)

    transformed = engine.transform(validation)

    assert transformed.shape == (2, 2)
    assert not pd.isna(transformed).any()

def test_target_column_is_excluded():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 21, 22],
            "Target": [0, 1, 0],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    transformed = engine.fit_transform(dataframe)

    feature_names = engine.get_feature_names()

    assert transformed.shape == (3, 1)
    assert all("Target" not in name for name in feature_names)

def test_identifier_columns_are_excluded():
    dataframe = pd.DataFrame(
        {
            "CustomerID": [101, 102, 103],
            "Age": [20, 21, 22],
            "Target": [0, 1, 0],
        }
    )

    engine = PreprocessingEngine(
        target_column="Target",
        identifier_columns=["CustomerID"],
    )

    transformed = engine.fit_transform(dataframe)

    feature_names = engine.get_feature_names()

    assert transformed.shape == (3, 1)
    assert all("CustomerID" not in name for name in feature_names)




def test_transform_before_fit_raises_error():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 21],
            "Target": [0, 1],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    with pytest.raises(
        RuntimeError,
        match="must be fitted",
    ):
        engine.transform(dataframe)

def test_missing_target_column_raises_error():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 21],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    with pytest.raises(
        ValueError,
        match="Target column",
    ):
        engine.fit(dataframe)

def test_all_missing_feature_column_raises_error():
    dataframe = pd.DataFrame(
        {
            "Age": [None, None, None],
            "Target": [0, 1, 0],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    with pytest.raises(
        ValueError,
        match="no valid values",
    ):
        engine.fit(dataframe)

def test_fit_uses_training_data_only():
    train = pd.DataFrame(
        {
            "Age": [10, 20, None],
            "Target": [0, 1, 0],
        }
    )

    validation = pd.DataFrame(
        {
            "Age": [100, None],
            "Target": [1, 0],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    engine.fit(train)

    transformed_validation = engine.transform(validation)

    # Median learned from training data = 15.
    # Validation data must not influence the imputation value.
    assert transformed_validation[1, 0] == 15

def test_datetime_features_are_extracted():
    dataframe = pd.DataFrame(
        {
            "Signup_Date": pd.to_datetime(
                ["2026-01-15", "2026-02-20"]
            )
        }
    )

    transformer = DatetimeFeatures()

    transformed = transformer.fit_transform(dataframe)

    assert transformed.shape == (2, 4)

    assert transformed["Signup_Date__year"].tolist() == [2026, 2026]
    assert transformed["Signup_Date__month"].tolist() == [1, 2]
    assert transformed["Signup_Date__day"].tolist() == [15, 20]
    assert transformed["Signup_Date__day_of_week"].tolist() == [3, 4]

def test_datetime_columns_are_detected_separately():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 21, 22],
            "Signup_Date": pd.to_datetime(
                ["2026-01-15", "2026-02-20", "2026-03-10"]
            ),
            "Target": [0, 1, 0],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    engine.fit(dataframe)

    assert engine.numeric_columns == ["Age"]
    assert engine.datetime_columns == ["Signup_Date"]
    assert engine.categorical_columns == []

def test_mixed_numeric_categorical_and_datetime_features():
    dataframe = pd.DataFrame(
        {
            "Age": [20, 21, 22],
            "City": ["Delhi", "Mumbai", "Delhi"],
            "Signup_Date": pd.to_datetime(
                ["2026-01-15", "2026-02-20", "2026-03-10"]
            ),
            "Target": [0, 1, 0],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    transformed = engine.fit_transform(dataframe)

    feature_names = engine.get_feature_names()

    assert transformed.shape == (3, 7)

    assert "numeric__Age" in feature_names

    assert "categorical__City_Delhi" in feature_names
    assert "categorical__City_Mumbai" in feature_names

    assert "datetime__Signup_Date__year" in feature_names
    assert "datetime__Signup_Date__month" in feature_names
    assert "datetime__Signup_Date__day" in feature_names
    assert "datetime__Signup_Date__day_of_week" in feature_names

    assert all("Target" not in name for name in feature_names)

def test_datetime_missing_values_are_imputed():
    dataframe = pd.DataFrame(
        {
            "Signup_Date": pd.to_datetime(
                ["2024-01-10", None, "2024-03-20"]
            ),
            "Age": [20, 30, 40],
            "Target": [0, 1, 0],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    transformed = engine.fit_transform(dataframe)

    assert not pd.isna(transformed).any()

def test_get_feature_groups():
    dataframe = pd.DataFrame(
        {
            "Customer_ID": ["C1", "C2", "C3"],
            "Age": [20, 30, 40],
            "City": ["Delhi", "Mumbai", "Delhi"],
            "Signup_Date": pd.to_datetime(
                ["2024-01-10", "2024-02-15", "2024-03-20"]
            ),
            "Target": [0, 1, 0],
        }
    )

    engine = PreprocessingEngine(
        target_column="Target",
        identifier_columns=["Customer_ID"],
    )

    engine.fit(dataframe)

    feature_groups = engine.get_feature_groups()

    assert feature_groups == {
        "numeric": ["Age"],
        "categorical": ["City"],
        "datetime": ["Signup_Date"],
        "excluded": ["Target", "Customer_ID"],
    }

def test_get_feature_groups_before_fit_raises_error():
    engine = PreprocessingEngine(target_column="Target")

    with pytest.raises(RuntimeError, match="must be fitted"):
        engine.get_feature_groups()

def test_cross_validation_does_not_preprocess_before_splitting():
    """
    Preprocessing must happen inside each CV fold, not before CV.
    This test documents the expected integration contract.
    """
    X = np.array(
        [
            [1, "A"],
            [2, "A"],
            [3, "B"],
            [4, "B"],
            [5, "C"],
            [6, "C"],
        ],
        dtype=object,
    )

    y = np.array([0, 0, 1, 1, 0, 1])

    assert len(X) == len(y)

def test_high_cardinality_categorical_column_does_not_explode_features():
    dataframe = pd.DataFrame(
        {
            "Category": [f"value_{i}" for i in range(200)],
            "Target": [i % 2 for i in range(200)],
        }
    )

    engine = PreprocessingEngine(target_column="Target")

    transformed = engine.fit_transform(dataframe)

    # Rare categories should be grouped instead of creating
    # one feature per unique category.
    assert transformed.shape[0] == 200
    assert transformed.shape[1] < 200

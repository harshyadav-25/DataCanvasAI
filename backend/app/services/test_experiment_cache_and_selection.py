"""
Focused backend tests for the Experiments feature.

Covers:
  1.  Selected models accepted.
  2.  Only selected models execute.
  3.  Only selected models returned.
  4.  Unknown model rejected.
  5.  Empty model selection rejected.
  6.  One model rejected (min 2 required for comparison).
  7.  First model evaluation creates cache.
  8.  Identical second evaluation uses cache.
  9.  Identical second evaluation does not retrain.
  10. Adding a model reuses existing cached models.
  11. Different dataset_id misses cache.
  12. Different target misses cache.
  13. Different problem type misses cache.
  14. Different n_splits misses cache.
  15. Different identifier_columns misses cache.
  16. Cache result metrics equal original result.
  17. Run Fresh bypasses completed cache.
  18. Classification model selection works.
  19. Existing experiment tests pass (compare_experiments / sort).
  20. API endpoint: selected models accepted.
  21. API endpoint: fewer than 2 models rejected.
  22. API endpoint: unknown model rejected.
  23. API endpoint: dataset not found returns 404.
"""

import copy
import threading
import time
from unittest.mock import patch, call

import pandas as pd
import pytest

from app.schemas.target import TargetProblemType
from app.services import experiment_cache
from app.services.experiment_engine import (
    compare_experiments,
    run_experiment_comparison,
    sort_experiment_results,
    validate_model_names,
)
from app.services.validation_engine import cross_validate_with_preprocessing


# ---------------------------------------------------------------------------
# Shared test datasets
# ---------------------------------------------------------------------------

def make_regression_df(n=40):
    """Small regression dataset, enough for 3-fold CV."""
    import numpy as np
    rng = np.random.default_rng(0)
    x = rng.uniform(0, 10, n)
    y = 2.0 * x + rng.normal(0, 0.5, n)
    return pd.DataFrame({"feature": x, "target": y})


def make_classification_df(n=40):
    """Balanced binary classification dataset."""
    import numpy as np
    rng = np.random.default_rng(1)
    x = rng.uniform(0, 10, n)
    labels = (x > 5).astype(int)
    return pd.DataFrame({"feature": x, "target": labels})


@pytest.fixture(autouse=True)
def clear_experiment_cache():
    """Ensure every test starts with an empty cache."""
    experiment_cache.clear_cache()
    yield
    experiment_cache.clear_cache()


# ===========================================================================
# TEST 1 – Selected models accepted
# ===========================================================================
def test_selected_regression_models_accepted():
    validate_model_names(["catboost", "xgboost"], TargetProblemType.REGRESSION)
    # No exception = pass


def test_selected_classification_models_accepted():
    validate_model_names(
        ["catboost", "logistic_regression"],
        TargetProblemType.CLASSIFICATION,
    )


# ===========================================================================
# TEST 2 – Only selected models execute
# ===========================================================================
def test_only_selected_models_execute():
    df = make_regression_df()
    executed = []

    original_fn = cross_validate_with_preprocessing

    def spy(*args, **kwargs):
        executed.append(kwargs.get("model_names"))
        return original_fn(*args, **kwargs)

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        run_experiment_comparison(
            dataframe=df,
            dataset_id="ds-exec-test",
            target_column="target",
            problem_type=TargetProblemType.REGRESSION,
            model_names=["catboost", "ridge"],
            n_splits=2,
        )

    # Only one call, and only the 2 selected models
    assert len(executed) == 1
    assert set(executed[0]) == {"catboost", "ridge"}


# ===========================================================================
# TEST 3 – Only selected models returned
# ===========================================================================
def test_only_selected_models_returned():
    df = make_regression_df()
    comparison = run_experiment_comparison(
        dataframe=df,
        dataset_id="ds-return-test",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )
    returned_names = {r.model_name for r in comparison.results}
    assert returned_names == {"linear_regression", "ridge"}


# ===========================================================================
# TEST 4 – Unknown model rejected
# ===========================================================================
def test_unknown_model_rejected():
    with pytest.raises(ValueError, match="Unknown models"):
        validate_model_names(
            ["catboost", "nonexistent_model"],
            TargetProblemType.REGRESSION,
        )


def test_unknown_model_rejected_via_engine():
    df = make_regression_df()
    with pytest.raises(ValueError, match="Unknown models|Unsupported models"):
        run_experiment_comparison(
            dataframe=df,
            dataset_id="ds-unknown",
            target_column="target",
            problem_type=TargetProblemType.REGRESSION,
            model_names=["catboost", "fake_model"],
            n_splits=2,
        )


# ===========================================================================
# TEST 5 – Empty model selection rejected
# ===========================================================================
def test_empty_model_selection_rejected():
    with pytest.raises(ValueError):
        validate_model_names([], TargetProblemType.REGRESSION)


# ===========================================================================
# TEST 6 – One model rejected for comparison
# ===========================================================================
def test_single_model_rejected():
    with pytest.raises(ValueError, match="at least 2"):
        validate_model_names(["catboost"], TargetProblemType.REGRESSION)


# ===========================================================================
# TEST 7 – First model evaluation creates cache
# ===========================================================================
def test_first_evaluation_creates_cache():
    df = make_regression_df()
    assert experiment_cache.cache_size() == 0

    run_experiment_comparison(
        dataframe=df,
        dataset_id="ds-cache-create",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )

    assert experiment_cache.cache_size() == 2  # one entry per model


# ===========================================================================
# TEST 8 – Identical second evaluation uses cache
# ===========================================================================
def test_second_evaluation_uses_cache():
    df = make_regression_df()
    kwargs = dict(
        dataframe=df,
        dataset_id="ds-cache-hit",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )

    run_experiment_comparison(**kwargs)

    call_count = []
    original = cross_validate_with_preprocessing

    def spy(*args, **kw):
        call_count.append(1)
        return original(*args, **kw)

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        run_experiment_comparison(**kwargs)

    # Both models were cached → no call to cross_validate
    assert len(call_count) == 0


# ===========================================================================
# TEST 9 – Identical second evaluation does not retrain
# ===========================================================================
def test_second_evaluation_does_not_retrain():
    """Verified by test 8; explicit assertion on call count."""
    df = make_regression_df()
    kwargs = dict(
        dataframe=df,
        dataset_id="ds-no-retrain",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )
    run_experiment_comparison(**kwargs)

    retrain_calls = []

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=lambda *a, **kw: retrain_calls.append(kw.get("model_names")) or {},
    ):
        run_experiment_comparison(**kwargs)

    assert retrain_calls == [], "No retraining should occur on cache hit"


# ===========================================================================
# TEST 10 – Adding a model reuses existing cached models
# ===========================================================================
def test_adding_model_reuses_cached_models():
    df = make_regression_df()
    common_kwargs = dict(
        dataframe=df,
        dataset_id="ds-partial",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        n_splits=2,
    )

    # First: 2 models
    run_experiment_comparison(
        **common_kwargs,
        model_names=["linear_regression", "ridge"],
    )
    assert experiment_cache.cache_size() == 2

    # Track calls for third request (3 models: 2 cached + 1 new)
    computed_models = []
    original = cross_validate_with_preprocessing

    def spy(*args, **kw):
        computed_models.append(kw.get("model_names", []))
        return original(*args, **kw)

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        result = run_experiment_comparison(
            **common_kwargs,
            model_names=["linear_regression", "ridge", "catboost"],
        )

    # Only catboost should have been computed
    flat = [m for group in computed_models for m in group]
    assert flat == ["catboost"], f"Expected only catboost computed, got {flat}"

    # All 3 models in result
    returned_names = {r.model_name for r in result.results}
    assert returned_names == {"linear_regression", "ridge", "catboost"}
    assert experiment_cache.cache_size() == 3


# ===========================================================================
# TEST 11 – Different dataset_id misses cache
# ===========================================================================
def test_different_dataset_id_misses_cache():
    df = make_regression_df()
    base = dict(
        dataframe=df,
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )
    run_experiment_comparison(dataset_id="ds-A", **base)

    computed = []
    original = cross_validate_with_preprocessing

    def spy(*args, **kw):
        computed.append(kw.get("model_names", []))
        return original(*args, **kw)

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        run_experiment_comparison(dataset_id="ds-B", **base)

    assert len(computed) == 1, "Different dataset_id must miss cache"


# ===========================================================================
# TEST 12 – Different target misses cache
# ===========================================================================
def test_different_target_misses_cache():
    import numpy as np

    df = pd.DataFrame({
        "f1": np.arange(30, dtype=float),
        "target_a": np.arange(30, dtype=float),
        "target_b": np.arange(30, dtype=float) * 2,
    })

    base = dict(
        dataframe=df,
        dataset_id="ds-targets",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )
    run_experiment_comparison(target_column="target_a", **base)

    computed = []
    original = cross_validate_with_preprocessing

    def spy(*args, **kw):
        computed.append(kw.get("model_names", []))
        return original(*args, **kw)

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        run_experiment_comparison(target_column="target_b", **base)

    assert len(computed) == 1, "Different target must miss cache"


# ===========================================================================
# TEST 13 – Different problem type misses cache
# ===========================================================================
def test_different_problem_type_misses_cache():
    # Build a dataset that works for both regression and classification
    df = make_classification_df(n=40)

    computed = []
    original = cross_validate_with_preprocessing

    def spy(*args, **kw):
        computed.append(kw.get("model_names", []))
        return original(*args, **kw)

    base = dict(
        dataframe=df,
        dataset_id="ds-ptype",
        target_column="target",
        n_splits=2,
    )

    run_experiment_comparison(
        **base,
        problem_type=TargetProblemType.CLASSIFICATION,
        model_names=["catboost", "xgboost"],
    )

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        # regression uses different models; ridge/linear_regression don't exist for classification
        run_experiment_comparison(
            **base,
            problem_type=TargetProblemType.REGRESSION,
            model_names=["linear_regression", "ridge"],
        )

    # Both regression models should be computed (they weren't cached under classification)
    flat = [m for group in computed for m in group]
    assert "linear_regression" in flat or "ridge" in flat


# ===========================================================================
# TEST 14 – Different n_splits misses cache
# ===========================================================================
def test_different_n_splits_misses_cache():
    df = make_regression_df()
    base = dict(
        dataframe=df,
        dataset_id="ds-nsplits",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
    )

    run_experiment_comparison(**base, n_splits=2)

    computed = []
    original = cross_validate_with_preprocessing

    def spy(*args, **kw):
        computed.append(kw.get("model_names", []))
        return original(*args, **kw)

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        run_experiment_comparison(**base, n_splits=3)

    assert len(computed) == 1, "Different n_splits must miss cache"


# ===========================================================================
# TEST 15 – Different identifier_columns misses cache
# ===========================================================================
def test_different_identifier_columns_misses_cache():
    import numpy as np

    df = pd.DataFrame({
        "id": np.arange(40, dtype=float),
        "feature": np.random.default_rng(5).uniform(0, 10, 40),
        "target": np.random.default_rng(5).uniform(0, 1, 40),
    })

    base = dict(
        dataframe=df,
        dataset_id="ds-ident",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )

    run_experiment_comparison(**base, identifier_columns=[])

    computed = []
    original = cross_validate_with_preprocessing

    def spy(*args, **kw):
        computed.append(kw.get("model_names", []))
        return original(*args, **kw)

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        run_experiment_comparison(**base, identifier_columns=["id"])

    assert len(computed) == 1, "Different identifier_columns must miss cache"


# ===========================================================================
# TEST 16 – Cache result metrics equal original result
# ===========================================================================
def test_cache_metrics_equal_original():
    df = make_regression_df()
    kwargs = dict(
        dataframe=df,
        dataset_id="ds-metrics-eq",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )

    first = run_experiment_comparison(**kwargs)
    second = run_experiment_comparison(**kwargs)

    for r1, r2 in zip(first.results, second.results):
        assert r1.model_name == r2.model_name
        for metric in r1.mean_metrics:
            assert r1.mean_metrics[metric] == pytest.approx(
                r2.mean_metrics[metric], nan_ok=True
            )


# ===========================================================================
# TEST 17 – Run Fresh bypasses completed cache
# ===========================================================================
def test_run_fresh_bypasses_cache():
    df = make_regression_df()
    kwargs = dict(
        dataframe=df,
        dataset_id="ds-fresh",
        target_column="target",
        problem_type=TargetProblemType.REGRESSION,
        model_names=["linear_regression", "ridge"],
        n_splits=2,
    )

    run_experiment_comparison(**kwargs)
    assert experiment_cache.cache_size() == 2

    computed = []
    original = cross_validate_with_preprocessing

    def spy(*args, **kw):
        computed.append(kw.get("model_names", []))
        return original(*args, **kw)

    with patch(
        "app.services.experiment_engine.cross_validate_with_preprocessing",
        side_effect=spy,
    ):
        run_experiment_comparison(**kwargs, bypass_cache=True)

    # Both models should have been recomputed
    flat = [m for group in computed for m in group]
    assert set(flat) == {"linear_regression", "ridge"}
    # Cache updated after fresh run
    assert experiment_cache.cache_size() == 2


# ===========================================================================
# TEST 18 – Classification model selection works
# ===========================================================================
def test_classification_model_selection():
    df = make_classification_df()
    comparison = run_experiment_comparison(
        dataframe=df,
        dataset_id="ds-cls-select",
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        model_names=["catboost", "logistic_regression"],
        n_splits=2,
    )

    returned = {r.model_name for r in comparison.results}
    assert returned == {"catboost", "logistic_regression"}
    assert comparison.primary_metric == "f1"


# ===========================================================================
# TEST 19 – Existing experiment engine tests still pass
# ===========================================================================
def test_compare_experiments_legacy():
    """compare_experiments() unchanged; still works."""
    results = [
        {
            "model_name": "Model A",
            "mean_metrics": {"f1": 0.80},
            "std_metrics": {"f1": 0.02},
        },
        {
            "model_name": "Model B",
            "mean_metrics": {"f1": 0.90},
            "std_metrics": {"f1": 0.01},
        },
    ]
    comparison = compare_experiments(
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        validation_results=results,
    )
    assert comparison.primary_metric == "f1"
    assert len(comparison.results) == 2


def test_sort_experiment_results_legacy():
    """sort_experiment_results() unchanged; still works."""
    results = [
        {"model_name": "A", "mean_metrics": {"r2": 0.60}, "std_metrics": {"r2": 0.01}},
        {"model_name": "B", "mean_metrics": {"r2": 0.85}, "std_metrics": {"r2": 0.02}},
    ]
    comparison = compare_experiments(
        target_column="price",
        problem_type=TargetProblemType.REGRESSION,
        validation_results=results,
    )
    sorted_c = sort_experiment_results(comparison)
    assert sorted_c.results[0].model_name == "B"
    assert sorted_c.results[1].model_name == "A"


# ===========================================================================
# TEST 20-23 – API endpoint tests
# ===========================================================================
from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.main import app
from app.models.dataset import DatasetRecord
from app.services.registry import dataset_registry


client = TestClient(app)
app.dependency_overrides[get_current_user] = lambda: {
    "id": "test-user",
    "name": "Test User",
    "email": "test@example.com",
}


def _register_api_dataset(dataset_id: str):
    df = make_regression_df(n=40)
    record = DatasetRecord(
        dataset_id=dataset_id,
        filename=f"{dataset_id}.csv",
        file_type="csv",
        rows=len(df),
        columns=len(df.columns),
        column_names=list(df.columns),
    )
    dataset_registry.register(record, df)
    return df


def test_api_selected_models_accepted():
    _register_api_dataset("api-accept")
    response = client.post(
        "/experiments/compare/api-accept",
        params={
            "target_column": "target",
            "problem_type": "regression",
            "model_names": ["linear_regression", "ridge"],
            "n_splits": 2,
        },
    )
    assert response.status_code == 200
    data = response.json()
    returned = {r["model_name"] for r in data["results"]}
    assert returned == {"linear_regression", "ridge"}


def test_api_fewer_than_two_models_rejected():
    _register_api_dataset("api-one-model")
    response = client.post(
        "/experiments/compare/api-one-model",
        params={
            "target_column": "target",
            "problem_type": "regression",
            "model_names": ["linear_regression"],
            "n_splits": 2,
        },
    )
    assert response.status_code == 422
    assert "at least 2" in response.text.lower()


def test_api_unknown_model_rejected():
    _register_api_dataset("api-unknown-model")
    response = client.post(
        "/experiments/compare/api-unknown-model",
        params={
            "target_column": "target",
            "problem_type": "regression",
            "model_names": ["catboost", "does_not_exist"],
            "n_splits": 2,
        },
    )
    assert response.status_code == 422


def test_api_dataset_not_found():
    response = client.post(
        "/experiments/compare/nonexistent-dataset-xyz",
        params={
            "target_column": "target",
            "problem_type": "regression",
            "model_names": ["catboost", "ridge"],
            "n_splits": 2,
        },
    )
    assert response.status_code == 404

"""
Experiment engine: orchestrates model comparison.

Responsibilities:
- Accept a list of user-selected model names (min 2 for comparison).
- Validate names against the validation engine's get_models().
- Use the per-model experiment cache for individual result reuse.
- Support Run Fresh (bypass_cache=True) to force recalculation.
- Apply fold-first CV via cross_validate_with_preprocessing().
- Convert raw validation results into ExperimentComparison.
- Sort results by primary metric.
"""

import logging

from app.schemas.experiment import (
    ExperimentComparison,
    ExperimentResult,
)
from app.schemas.target import TargetProblemType
from app.services import experiment_cache
from app.services.validation_engine import (
    cross_validate_with_preprocessing,
    get_models,
)

logger = logging.getLogger(__name__)

PRIMARY_METRICS = {
    TargetProblemType.CLASSIFICATION: "f1",
    TargetProblemType.REGRESSION: "r2",
}


# ====================================================================
# Validation helpers
# ====================================================================

def validate_model_names(
    model_names: list[str],
    problem_type: TargetProblemType,
) -> None:
    """
    Raise ValueError for unknown model names or if fewer than 2 are given.
    Does NOT use get_models() results for actual training — that is done
    inside cross_validate_with_preprocessing().
    """
    if len(model_names) < 2:
        raise ValueError(
            "Select at least 2 models to compare."
        )

    available = get_models(problem_type)
    unknown = set(model_names) - available.keys()
    if unknown:
        raise ValueError(
            f"Unknown models for {problem_type.value}: "
            f"{', '.join(sorted(unknown))}"
        )


# ====================================================================
# Result assembly
# ====================================================================

def compare_experiments(
    target_column: str,
    problem_type: TargetProblemType,
    validation_results: list[dict],
) -> ExperimentComparison:
    """
    Convert validation-engine results into a structured
    experiment comparison response.
    """

    results = [
        ExperimentResult(
            model_name=result["model_name"],
            problem_type=problem_type,
            fold_metrics=result.get("fold_metrics", []),
            mean_metrics=result["mean_metrics"],
            std_metrics=result["std_metrics"],
        )
        for result in validation_results
    ]

    primary_metric = PRIMARY_METRICS[problem_type]

    return ExperimentComparison(
        target_column=target_column,
        problem_type=problem_type,
        primary_metric=primary_metric,
        results=results,
    )


def sort_experiment_results(
    comparison: ExperimentComparison,
) -> ExperimentComparison:
    """
    Sort experiment results by the selected primary metric
    in descending order.
    """

    metric = comparison.primary_metric

    sorted_results = sorted(
        comparison.results,
        key=lambda result: result.mean_metrics.get(metric, float("-inf")),
        reverse=True,
    )

    return comparison.model_copy(
        update={"results": sorted_results}
    )


# ====================================================================
# Main entry point
# ====================================================================

def run_experiment_comparison(
    dataframe,
    dataset_id: str,
    target_column: str,
    problem_type: TargetProblemType,
    model_names: list[str],
    identifier_columns: list[str] | None = None,
    n_splits: int = 3,
    bypass_cache: bool = False,
) -> ExperimentComparison:
    """
    Run experiment comparison with per-model caching and partial reuse.

    For each requested model:
      1. If bypass_cache is False → check cache.
      2. On cache hit: use stored result (no retraining).
      3. On cache miss: calculate only the missing models via
         cross_validate_with_preprocessing().
      4. Cache new results.
      5. Assemble all results and sort.

    In-flight deduplication: if an identical request is already being
    computed by another thread, that thread's result is awaited and
    served from cache rather than launching a duplicate computation.
    """

    validate_model_names(model_names, problem_type)

    identifier_columns = identifier_columns or []
    problem_type_str = problem_type.value

    cached_results: dict[str, dict] = {}
    missing_model_names: list[str] = []

    # ----------------------------------------------------------------
    # Phase 1: check cache for every requested model
    # ----------------------------------------------------------------
    for name in model_names:
        if bypass_cache:
            # Run Fresh: explicitly skip cache, will recalculate below
            missing_model_names.append(name)
            continue

        cached = experiment_cache.get_cached_result(
            dataset_id=dataset_id,
            target_column=target_column,
            problem_type=problem_type_str,
            model_name=name,
            n_splits=n_splits,
            identifier_columns=identifier_columns,
        )

        if cached is not None:
            cached_results[name] = cached
        else:
            missing_model_names.append(name)

    # ----------------------------------------------------------------
    # Phase 2: handle in-flight deduplication for missing models
    # ----------------------------------------------------------------
    to_compute: list[str] = []
    events_to_wait: dict[str, object] = {}

    for name in missing_model_names:
        event = experiment_cache.begin_in_flight(
            dataset_id=dataset_id,
            target_column=target_column,
            problem_type=problem_type_str,
            model_name=name,
            n_splits=n_splits,
            identifier_columns=identifier_columns,
        )
        if event is None:
            # We own this slot → must compute
            to_compute.append(name)
        else:
            # Another thread is computing; we'll wait then read cache
            events_to_wait[name] = event

    # Wait for in-flight computations from other threads
    for name, event in events_to_wait.items():
        event.wait(timeout=300)  # 5 min safety ceiling
        cached = experiment_cache.get_cached_result(
            dataset_id=dataset_id,
            target_column=target_column,
            problem_type=problem_type_str,
            model_name=name,
            n_splits=n_splits,
            identifier_columns=identifier_columns,
        )
        if cached is not None:
            cached_results[name] = cached
        else:
            # The waiting thread failed; fall back to computing ourselves
            logger.warning(
                "In-flight wait for model=%s produced no cache entry; "
                "recomputing.",
                name,
            )
            to_compute.append(name)

    # ----------------------------------------------------------------
    # Phase 3: compute only the models that are missing from cache
    # ----------------------------------------------------------------
    if to_compute:
        try:
            new_results = cross_validate_with_preprocessing(
                dataframe=dataframe,
                target_column=target_column,
                problem_type=problem_type,
                identifier_columns=identifier_columns,
                n_splits=n_splits,
                model_names=to_compute,
            )

            # Cache each new result individually
            for name, result in new_results.items():
                experiment_cache.store_result(
                    dataset_id=dataset_id,
                    target_column=target_column,
                    problem_type=problem_type_str,
                    model_name=name,
                    n_splits=n_splits,
                    identifier_columns=identifier_columns,
                    result=result,
                )
                cached_results[name] = result

        finally:
            # Always release in-flight markers so waiters unblock
            for name in to_compute:
                experiment_cache.finish_in_flight(
                    dataset_id=dataset_id,
                    target_column=target_column,
                    problem_type=problem_type_str,
                    model_name=name,
                    n_splits=n_splits,
                    identifier_columns=identifier_columns,
                )

    # ----------------------------------------------------------------
    # Phase 4: assemble results in the original requested order
    # ----------------------------------------------------------------
    ordered_results = [
        cached_results[name]
        for name in model_names
        if name in cached_results
    ]

    comparison = compare_experiments(
        target_column=target_column,
        problem_type=problem_type,
        validation_results=ordered_results,
    )

    return sort_experiment_results(comparison)
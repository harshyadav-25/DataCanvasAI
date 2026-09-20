from app.schemas.experiment import (
    ExperimentComparison,
    ExperimentResult,
)
from app.schemas.target import TargetProblemType
from app.services.validation_engine import cross_validate_with_preprocessing


PRIMARY_METRICS = {
    TargetProblemType.CLASSIFICATION: "f1",
    TargetProblemType.REGRESSION: "r2",
}


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
    
def run_experiment_comparison(
    dataframe,
    target_column: str,
    problem_type: TargetProblemType,
    identifier_columns: list[str] | None = None,
    n_splits: int = 5,
) -> ExperimentComparison:
    """
    Run leakage-safe cross-validation using the existing
    validation engine and convert the results into an
    experiment comparison.
    """

    validation_results = cross_validate_with_preprocessing(
        dataframe=dataframe,
        target_column=target_column,
        problem_type=problem_type,
        identifier_columns=identifier_columns,
        n_splits=n_splits,
    )

    comparison = compare_experiments(
        target_column=target_column,
        problem_type=problem_type,
        validation_results=list(validation_results.values()),
    )

    return sort_experiment_results(comparison)
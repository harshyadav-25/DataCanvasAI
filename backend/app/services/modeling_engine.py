from app.schemas.modeling import ModelTrainingResponse, ModelTrainingResult
from app.schemas.target import TargetProblemType
from app.services.validation_engine import (
    cross_validate_with_preprocessing,
    get_models,
    get_safe_n_splits,
)


def train_selected_model(
    dataset_id: str,
    dataframe,
    target_column: str,
    problem_type: TargetProblemType,
    model_name: str,
    identifier_columns: list[str] | None = None,
    n_splits: int = 2,
) -> ModelTrainingResponse:
    available_models = get_models(problem_type)
    if model_name not in available_models:
        raise ValueError(
            f"Model '{model_name}' is not supported for "
            f"{problem_type.value}"
        )

    safe_n_splits = get_safe_n_splits(
        dataframe[target_column].to_numpy(),
        problem_type,
        n_splits,
    )
    validation_results = cross_validate_with_preprocessing(
        dataframe=dataframe,
        target_column=target_column,
        problem_type=problem_type,
        identifier_columns=identifier_columns,
        n_splits=safe_n_splits,
        model_names=[model_name],
    )
    result = validation_results[model_name]

    return ModelTrainingResponse(
        dataset_id=dataset_id,
        target_column=target_column,
        problem_type=problem_type,
        model_name=model_name,
        n_splits=safe_n_splits,
        results=[
            ModelTrainingResult(
                model_name=result["model_name"],
                fold_metrics=result["fold_metrics"],
                mean_metrics=result["mean_metrics"],
                std_metrics=result["std_metrics"],
            )
        ],
    )

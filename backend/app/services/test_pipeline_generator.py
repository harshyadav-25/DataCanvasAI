import pytest

from app.schemas.pipeline import PipelineCodeRequest
from app.schemas.target import TargetProblemType
from app.services.pipeline_generator import generate_pipeline_code


def test_generate_classification_pipeline():
    request = PipelineCodeRequest(
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        model_name="logistic_regression",
        identifier_columns=["id"],
    )

    code = generate_pipeline_code(request)

    assert "pd.read_csv" in code
    assert "target_column = 'target'" in code
    assert "identifier_columns = ['id']" in code
    assert "LogisticRegression" in code
    assert "ColumnTransformer" in code
    assert "OneHotEncoder" in code
    assert "SimpleImputer" in code
    assert "accuracy_score" in code
    assert "f1_score" in code


def test_generate_regression_pipeline():
    request = PipelineCodeRequest(
        target_column="price",
        problem_type=TargetProblemType.REGRESSION,
        model_name="ridge",
    )

    code = generate_pipeline_code(request)

    assert "target_column = 'price'" in code
    assert "Ridge()" in code
    assert "mean_absolute_error" in code
    assert "mean_squared_error" in code
    assert "r2_score" in code


def test_generate_catboost_pipeline():
    request = PipelineCodeRequest(
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        model_name="catboost",
    )

    code = generate_pipeline_code(request)

    assert "CatBoostClassifier" in code
    assert "verbose=0" in code


def test_unsupported_model():
    request = PipelineCodeRequest(
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        model_name="random_forest",
    )

    with pytest.raises(ValueError, match="Unsupported model"):
        generate_pipeline_code(request)


def test_model_problem_type_mismatch():
    request = PipelineCodeRequest(
        target_column="price",
        problem_type=TargetProblemType.REGRESSION,
        model_name="logistic_regression",
    )

    with pytest.raises(ValueError, match="not supported"):
        generate_pipeline_code(request)

def test_generated_classification_code_is_valid_python():
    request = PipelineCodeRequest(
        target_column="target",
        problem_type=TargetProblemType.CLASSIFICATION,
        model_name="logistic_regression",
        identifier_columns=["id"],
    )

    code = generate_pipeline_code(request)

    compile(code, "<generated_pipeline>", "exec")
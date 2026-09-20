from app.schemas.pipeline import PipelineCodeRequest


MODEL_IMPORTS = {
    "catboost": "from catboost import CatBoostClassifier, CatBoostRegressor",
    "xgboost": "from xgboost import XGBClassifier, XGBRegressor",
    "lightgbm": "from lightgbm import LGBMClassifier, LGBMRegressor",
    "hist_gradient_boosting": (
        "from sklearn.ensemble import HistGradientBoostingClassifier, "
        "HistGradientBoostingRegressor"
    ),
    "logistic_regression": "from sklearn.linear_model import LogisticRegression",
    "linear_regression": "from sklearn.linear_model import LinearRegression",
    "ridge": "from sklearn.linear_model import Ridge",
}


MODEL_CLASSES = {
    "catboost": {
        "classification": "CatBoostClassifier(verbose=0, random_state=42)",
        "regression": "CatBoostRegressor(verbose=0, random_state=42)",
    },
    "xgboost": {
        "classification": "XGBClassifier(random_state=42, eval_metric='logloss')",
        "regression": "XGBRegressor(random_state=42)",
    },
    "lightgbm": {
        "classification": "LGBMClassifier(random_state=42, verbose=-1)",
        "regression": "LGBMRegressor(random_state=42, verbose=-1)",
    },
    "hist_gradient_boosting": {
        "classification": "HistGradientBoostingClassifier(random_state=42)",
        "regression": "HistGradientBoostingRegressor(random_state=42)",
    },
    "logistic_regression": {
        "classification": "LogisticRegression(max_iter=1000)",
    },
    "linear_regression": {
        "regression": "LinearRegression()",
    },
    "ridge": {
        "regression": "Ridge()",
    },
}


def generate_pipeline_code(request: PipelineCodeRequest) -> str:
    model_name = request.model_name.lower()
    problem_type = request.problem_type.value

    if model_name not in MODEL_CLASSES:
        raise ValueError(f"Unsupported model: {request.model_name}")

    if problem_type not in MODEL_CLASSES[model_name]:
        raise ValueError(
            f"Model '{request.model_name}' is not supported for "
            f"{problem_type}."
        )

    identifier_columns = repr(request.identifier_columns)

    model_import = MODEL_IMPORTS[model_name]
    model_class = MODEL_CLASSES[model_name][problem_type]

    if problem_type == "classification":
        metric_code = """
from sklearn.metrics import accuracy_score, f1_score

accuracy = accuracy_score(y_test, predictions)
f1 = f1_score(y_test, predictions, average="weighted")

print("Accuracy:", accuracy)
print("F1 Score:", f1)
"""
    else:
        metric_code = """
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)

print("MAE:", mae)
print("RMSE:", rmse)
print("R2:", r2)
"""

    return f'''import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder

{model_import}


# 1. Load dataset
df = pd.read_csv("your_dataset.csv")

# 2. Define target and identifier columns
target_column = {request.target_column!r}
identifier_columns = {identifier_columns}

X = df.drop(columns=[target_column] + identifier_columns)
y = df[target_column]


# 3. Detect feature types
numeric_features = X.select_dtypes(
    include=["number"]
).columns.tolist()

categorical_features = X.select_dtypes(
    include=["object", "category", "bool"]
).columns.tolist()


# 4. Build preprocessing pipelines
numeric_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
    ]
)

categorical_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore")),
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        ("numeric", numeric_pipeline, numeric_features),
        ("categorical", categorical_pipeline, categorical_features),
    ],
)


# 5. Create model
model = {model_class}


# 6. Build complete pipeline
pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)


# 7. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)


# 8. Train
pipeline.fit(X_train, y_train)


# 9. Predict
predictions = pipeline.predict(X_test)


# 10. Evaluate
{metric_code}
'''
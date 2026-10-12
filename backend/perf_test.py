import time
import pandas as pd
from app.schemas.target import TargetProblemType
from app.services.experiment_engine import run_experiment_comparison
from app.services import experiment_cache

def run_perf():
    print("Loading dataset...")
    # Let's generate a slightly larger dataset to see the time difference.
    import numpy as np
    n = 2000
    rng = np.random.default_rng(0)
    x1 = rng.uniform(0, 10, n)
    x2 = rng.uniform(-5, 5, n)
    y = 2.0 * x1 - 1.5 * x2 + rng.normal(0, 1.0, n)
    df = pd.DataFrame({"f1": x1, "f2": x2, "target": y})

    dataset_id = "perf-test"
    target = "target"
    problem_type = TargetProblemType.REGRESSION

    # Ensure cache is empty
    experiment_cache.clear_cache()

    # A. First run: 2 models x 3 folds
    print("\n--- A. First Run: 2 models (linear_regression, ridge) x 3 folds ---")
    start = time.perf_counter()
    resA = run_experiment_comparison(
        dataframe=df,
        dataset_id=dataset_id,
        target_column=target,
        problem_type=problem_type,
        model_names=["linear_regression", "ridge"],
        n_splits=3,
        bypass_cache=False
    )
    timeA = time.perf_counter() - start
    print(f"Time: {timeA:.4f}s")
    print(f"Models returned: {[r.model_name for r in resA.results]}")

    # B. Same request again
    print("\n--- B. Same Request Again (Cache Hit) ---")
    start = time.perf_counter()
    resB = run_experiment_comparison(
        dataframe=df,
        dataset_id=dataset_id,
        target_column=target,
        problem_type=problem_type,
        model_names=["linear_regression", "ridge"],
        n_splits=3,
        bypass_cache=False
    )
    timeB = time.perf_counter() - start
    print(f"Time: {timeB:.4f}s")
    print(f"Models returned: {[r.model_name for r in resB.results]}")

    # C. Add one new model
    print("\n--- C. Add new model (linear_regression, ridge, hist_gradient_boosting) ---")
    start = time.perf_counter()
    resC = run_experiment_comparison(
        dataframe=df,
        dataset_id=dataset_id,
        target_column=target,
        problem_type=problem_type,
        model_names=["linear_regression", "ridge", "hist_gradient_boosting"],
        n_splits=3,
        bypass_cache=False
    )
    timeC = time.perf_counter() - start
    print(f"Time: {timeC:.4f}s")
    print(f"Models returned: {[r.model_name for r in resC.results]}")

if __name__ == "__main__":
    run_perf()

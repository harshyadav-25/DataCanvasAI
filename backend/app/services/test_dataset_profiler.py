import pandas as pd

from app.services.dataset_profiler import DatasetProfiler


def test_profile_returns_correct_shape():
    dataframe = pd.DataFrame(
        {
            "Name": ["Harsh", "Rahul", "Aman"],
            "Age": [21, 22, 23],
        }
    )

    profile = DatasetProfiler().profile(dataframe)

    assert profile.rows == 3
    assert profile.columns == 2


def test_profile_calculates_missing_values():
    dataframe = pd.DataFrame(
        {
            "Name": ["Harsh", None, "Aman"],
            "Age": [21, None, 23],
        }
    )

    profile = DatasetProfiler().profile(dataframe)

    assert profile.total_missing_values == 2

    name_profile = profile.columns_profile[0]
    age_profile = profile.columns_profile[1]

    assert name_profile.missing_count == 1
    assert name_profile.missing_percentage == (1 / 3) * 100

    assert age_profile.missing_count == 1
    assert age_profile.missing_percentage == (1 / 3) * 100


def test_profile_counts_duplicate_rows():
    dataframe = pd.DataFrame(
        {
            "Name": ["Harsh", "Rahul", "Harsh"],
            "Age": [21, 22, 21],
        }
    )

    profile = DatasetProfiler().profile(dataframe)

    assert profile.duplicate_rows == 1


def test_profile_counts_unique_values():
    dataframe = pd.DataFrame(
        {
            "City": ["Kanpur", "Delhi", "Kanpur", "Mumbai"],
        }
    )

    profile = DatasetProfiler().profile(dataframe)

    city_profile = profile.columns_profile[0]

    assert city_profile.unique_count == 3
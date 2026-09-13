import pandas as pd

from app.models.profile import ColumnProfile, DatasetProfile


class DatasetProfiler:
    def profile(self, dataframe: pd.DataFrame) -> DatasetProfile:
        rows = len(dataframe)
        columns = len(dataframe.columns)

        duplicate_rows = int(dataframe.duplicated().sum())

        total_missing_values = int(
            dataframe.isna().sum().sum()
        )

        columns_profile = []

        for column in dataframe.columns:
            missing_count = int(
                dataframe[column].isna().sum()
            )

            missing_percentage = (
                (missing_count / rows) * 100
                if rows > 0
                else 0.0
            )

            unique_count = int(
                dataframe[column].nunique(dropna=True)
            )

            columns_profile.append(
                ColumnProfile(
                    name=str(column),
                    dtype=str(dataframe[column].dtype),
                    missing_count=missing_count,
                    missing_percentage=missing_percentage,
                    unique_count=unique_count,
                )
            )

        return DatasetProfile(
            rows=rows,
            columns=columns,
            duplicate_rows=duplicate_rows,
            total_missing_values=total_missing_values,
            columns_profile=columns_profile,
        )
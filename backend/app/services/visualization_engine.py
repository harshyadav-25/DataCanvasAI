import math

import numpy as np
import pandas as pd

from app.schemas.visualization import (
    NumericSummary,
    VisualizationChart,
    VisualizationResponse,
)

MAX_HISTOGRAM_BINS = 10
MAX_CATEGORIES = 10


def _numeric_chart(column: str, series: pd.Series) -> VisualizationChart:
    numeric_values = pd.to_numeric(series, errors="coerce").to_numpy(dtype=float)
    finite_values = numeric_values[np.isfinite(numeric_values)]

    if finite_values.size:
        quartiles = np.quantile(finite_values, [0.25, 0.5, 0.75])
        summary = NumericSummary(
            minimum=float(np.min(finite_values)),
            first_quartile=float(quartiles[0]),
            median=float(quartiles[1]),
            third_quartile=float(quartiles[2]),
            maximum=float(np.max(finite_values)),
            mean=float(np.mean(finite_values)),
        )
        bin_count = min(
            MAX_HISTOGRAM_BINS,
            max(1, math.ceil(math.sqrt(finite_values.size))),
        )
        counts, edges = np.histogram(finite_values, bins=bin_count)
        labels = [
            f"{edges[index]:.4g}–{edges[index + 1]:.4g}"
            for index in range(len(counts))
        ]
        values = [int(count) for count in counts]
    else:
        summary = None
        labels = []
        values = []

    return VisualizationChart(
        column=column,
        chart_type="histogram",
        title=f"Distribution of {column}",
        x_axis_label=column,
        y_axis_label="Row count",
        series_name="Rows",
        labels=labels,
        values=values,
        missing_count=int(series.isna().sum()),
        numeric_summary=summary,
    )


def _categorical_chart(column: str, series: pd.Series) -> VisualizationChart:
    counts = series.value_counts(dropna=False)
    labels = [
        "(Missing)" if pd.isna(value) else str(value)
        for value in counts.index[:MAX_CATEGORIES]
    ]
    values = [int(count) for count in counts.iloc[:MAX_CATEGORIES]]

    if len(counts) > MAX_CATEGORIES:
        labels.append("(Other)")
        values.append(int(counts.iloc[MAX_CATEGORIES:].sum()))

    return VisualizationChart(
        column=column,
        chart_type="bar",
        title=f"Frequency of {column}",
        x_axis_label=column,
        y_axis_label="Row count",
        series_name="Rows",
        labels=labels,
        values=values,
        missing_count=int(series.isna().sum()),
    )


def build_visualization(
    dataframe: pd.DataFrame,
    dataset_id: str,
    target_column: str | None = None,
) -> VisualizationResponse:
    charts = []

    for raw_column in dataframe.columns:
        column = str(raw_column)
        series = dataframe[raw_column]
        if pd.api.types.is_numeric_dtype(series.dtype):
            charts.append(_numeric_chart(column, series))
        else:
            charts.append(_categorical_chart(column, series))

    return VisualizationResponse(
        dataset_id=dataset_id,
        target_column=target_column,
        rows=len(dataframe),
        columns=len(dataframe.columns),
        charts=charts,
    )

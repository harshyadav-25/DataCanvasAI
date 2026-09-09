import re

import pandas as pd
from app.services.target_analyzer import analyze_target
from app.schemas.target import TargetAnalysis

from app.schemas.risk import RiskFinding, RiskSeverity


IDENTIFIER_NAME_PATTERN = re.compile(
    r"(^|[_\-\s])(id|key|uuid|identifier)($|[_\-\s])",
    re.IGNORECASE,
)

UNIQUENESS_THRESHOLD = 0.95


def detect_identifier_like_columns(
    dataframe: pd.DataFrame,
) -> list[RiskFinding]:
    findings = []

    row_count = len(dataframe)

    if row_count == 0:
        return findings

    for column in dataframe.columns:
        series = dataframe[column]

        unique_count = series.nunique(dropna=False)
        uniqueness_ratio = unique_count / row_count

        column_name = str(column)

        name_matches = bool(
            IDENTIFIER_NAME_PATTERN.search(column_name)
        )

        if uniqueness_ratio < UNIQUENESS_THRESHOLD:
            continue

        if not name_matches and not (
            pd.api.types.is_object_dtype(series)
            or pd.api.types.is_string_dtype(series)
        ):
            continue

        confidence = 0.90

        if name_matches:
            confidence = 0.98

        findings.append(
            RiskFinding(
                risk_type="IDENTIFIER_LIKE_COLUMN",
                severity=RiskSeverity.HIGH,
                column=column_name,
                title="Identifier-like feature detected",
                evidence={
                    "row_count": row_count,
                    "unique_count": unique_count,
                    "uniqueness_ratio": uniqueness_ratio,
                    "name_matches_identifier_pattern": name_matches,
                },
                explanation=(
                    "This column has very high uniqueness and may "
                    "represent an identifier rather than a useful "
                    "predictive feature. Investigate whether it "
                    "should be used for machine learning."
                ),
                confidence=confidence,
            )
        )

    return findings

IMBALANCE_THRESHOLD = 0.20
SEVERE_IMBALANCE_THRESHOLD = 0.10


def detect_class_imbalance(
    dataframe: pd.DataFrame,
    target_column: str,
) -> list[RiskFinding]:
    findings: list[RiskFinding] = []

    if dataframe.empty:
        return findings

    if target_column not in dataframe.columns:
        return findings

    target = dataframe[target_column].dropna()

    if target.empty:
        return findings

    class_counts = target.value_counts()

    # A target containing only one class is not ordinary imbalance.
    # A classification model cannot learn a meaningful class distinction.
    if len(class_counts) == 1:
        class_counts_json = {
            str(class_name): int(count)
            for class_name, count in class_counts.items()
        }

        findings.append(
            RiskFinding(
                risk_type="SINGLE_CLASS_TARGET",
                severity=RiskSeverity.CRITICAL,
                column=target_column,
                title="Target contains only one class",
                evidence={
                    "class_counts": class_counts_json,
                    "class_count": 1,
                },
                explanation=(
                    "The target contains only one class. "
                    "A classification model cannot learn a meaningful "
                    "distinction between multiple target classes."
                ),
                confidence=1.0,
            )
        )

        return findings

    total = int(class_counts.sum())

    class_counts_json = {
        str(class_name): int(count)
        for class_name, count in class_counts.items()
    }

    class_percentages = {
        str(class_name): float(count / total * 100)
        for class_name, count in class_counts.items()
    }

    minority_count = int(class_counts.min())
    majority_count = int(class_counts.max())

    minority_percentage = minority_count / total
    imbalance_ratio = majority_count / minority_count

    if minority_percentage >= IMBALANCE_THRESHOLD:
        return findings

    if minority_percentage < SEVERE_IMBALANCE_THRESHOLD:
        severity = RiskSeverity.HIGH
    else:
        severity = RiskSeverity.MEDIUM

    findings.append(
        RiskFinding(
            risk_type="CLASS_IMBALANCE",
            severity=severity,
            column=target_column,
            title="Class imbalance detected",
            evidence={
                "class_counts": class_counts_json,
                "class_percentages": class_percentages,
                "minority_percentage": minority_percentage * 100,
                "imbalance_ratio": imbalance_ratio,
            },
            explanation=(
                "The target classes are unevenly distributed. "
                "Accuracy alone may not adequately represent "
                "performance on the minority class. Consider "
                "precision, recall, and F1 when evaluating models."
            ),
            confidence=0.95,
        )
    )

    return findings
def analyze_target_column(
    dataframe: pd.DataFrame,
    target_column: str,
) -> TargetAnalysis:
from app.schemas.report import ExplainableReport


def build_explainable_report(
    dataset_id: str,
    readiness_score,
    findings,
    recommendations,
) -> ExplainableReport:
    return ExplainableReport(
        dataset_id=dataset_id,
        overall_readiness_score=readiness_score.overall_score,
        dimension_scores={
            "data_quality": readiness_score.dimensions.data_quality,
            "feature_quality": readiness_score.dimensions.feature_quality,
            "target_quality": readiness_score.dimensions.target_quality,
            "leakage_risk": readiness_score.dimensions.leakage_risk,
            "distribution_balance": readiness_score.dimensions.distribution_balance,
            "model_compatibility": readiness_score.dimensions.model_compatibility,
        },
        key_findings=[
            {
                "title": finding.title,
                "severity": finding.severity.value,
                "explanation": finding.explanation,
            }
            for finding in findings
        ],
        recommendations=[
            {
                "title": recommendation.title,
                "explanation": recommendation.explanation,
            }
            for recommendation in recommendations
        ],
    )
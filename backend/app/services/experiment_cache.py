"""
In-memory cache for individual experiment model results.

Cache key identity:
    (dataset_id, target_column, problem_type, model_name, n_splits,
     normalized_identifier_columns)

Each cache entry stores the serialisable model evaluation result dict
(model_name, fold_metrics, mean_metrics, std_metrics).

Cached objects are stored as deep copies to prevent accidental mutation
of stored results by later code that uses them.

The cache is intentionally process-scoped (in-memory only).  A backend
restart clears it.  This is acceptable per project requirements.
"""

import copy
import logging
import threading
from typing import Optional

logger = logging.getLogger(__name__)

# --------------------------------------------------------------------
# Internal store and lock
# --------------------------------------------------------------------

_cache: dict[tuple, dict] = {}
_in_flight: dict[tuple, threading.Event] = {}
_lock = threading.Lock()


# --------------------------------------------------------------------
# Key construction
# --------------------------------------------------------------------

def _make_key(
    dataset_id: str,
    target_column: str,
    problem_type: str,
    model_name: str,
    n_splits: int,
    identifier_columns: list[str],
) -> tuple:
    """
    Build a deterministic, hashable cache key.

    Identifier columns are sorted so that ["b", "a"] and ["a", "b"]
    produce the same key.
    """
    return (
        dataset_id,
        target_column,
        str(problem_type),
        model_name,
        n_splits,
        tuple(sorted(identifier_columns)),
    )


# --------------------------------------------------------------------
# Public API
# --------------------------------------------------------------------

def get_cached_result(
    dataset_id: str,
    target_column: str,
    problem_type: str,
    model_name: str,
    n_splits: int,
    identifier_columns: list[str],
) -> Optional[dict]:
    """
    Return a deep copy of the cached result for the given configuration,
    or None if no cached result exists.
    """
    key = _make_key(
        dataset_id,
        target_column,
        problem_type,
        model_name,
        n_splits,
        identifier_columns,
    )
    with _lock:
        result = _cache.get(key)

    if result is not None:
        logger.info(
            "Experiment cache HIT: dataset=%s model=%s target=%s "
            "n_splits=%d problem_type=%s",
            dataset_id,
            model_name,
            target_column,
            n_splits,
            problem_type,
        )
        return copy.deepcopy(result)

    logger.info(
        "Experiment cache MISS: dataset=%s model=%s target=%s "
        "n_splits=%d problem_type=%s",
        dataset_id,
        model_name,
        target_column,
        n_splits,
        problem_type,
    )
    return None


def store_result(
    dataset_id: str,
    target_column: str,
    problem_type: str,
    model_name: str,
    n_splits: int,
    identifier_columns: list[str],
    result: dict,
) -> None:
    """
    Store a deep copy of *result* in the cache.
    Overwrites any existing entry (used by Run Fresh).
    """
    key = _make_key(
        dataset_id,
        target_column,
        problem_type,
        model_name,
        n_splits,
        identifier_columns,
    )
    with _lock:
        _cache[key] = copy.deepcopy(result)


def invalidate(
    dataset_id: str,
    target_column: str,
    problem_type: str,
    model_name: str,
    n_splits: int,
    identifier_columns: list[str],
) -> None:
    """Remove a single model's cache entry (used by Run Fresh)."""
    key = _make_key(
        dataset_id,
        target_column,
        problem_type,
        model_name,
        n_splits,
        identifier_columns,
    )
    with _lock:
        _cache.pop(key, None)


# --------------------------------------------------------------------
# In-flight deduplication helpers
# --------------------------------------------------------------------

def begin_in_flight(
    dataset_id: str,
    target_column: str,
    problem_type: str,
    model_name: str,
    n_splits: int,
    identifier_columns: list[str],
) -> Optional[threading.Event]:
    """
    Mark a model evaluation as in-flight.

    Returns None  if this call successfully claimed the slot (caller
                  should compute the result and call finish_in_flight).
    Returns Event if another thread already claimed the slot (caller
                  should wait on the event and then read from cache).
    """
    key = _make_key(
        dataset_id,
        target_column,
        problem_type,
        model_name,
        n_splits,
        identifier_columns,
    )
    with _lock:
        if key in _in_flight:
            return _in_flight[key]
        event = threading.Event()
        _in_flight[key] = event
        return None


def finish_in_flight(
    dataset_id: str,
    target_column: str,
    problem_type: str,
    model_name: str,
    n_splits: int,
    identifier_columns: list[str],
) -> None:
    """
    Mark the in-flight computation as done and wake any waiters.
    Must be called (in a finally block) after begin_in_flight returned None.
    """
    key = _make_key(
        dataset_id,
        target_column,
        problem_type,
        model_name,
        n_splits,
        identifier_columns,
    )
    with _lock:
        event = _in_flight.pop(key, None)
    if event is not None:
        event.set()


def cache_size() -> int:
    """Return number of cached model results (for testing)."""
    with _lock:
        return len(_cache)


def clear_cache() -> None:
    """Remove all cached results (for testing)."""
    with _lock:
        _cache.clear()
        _in_flight.clear()

class UnsupportedFileTypeError(Exception):
    """Raised when the uploaded file format is not supported."""


class EmptyDatasetError(Exception):
    """Raised when the uploaded dataset contains no data."""


class DatasetReadError(Exception):
    """Raised when the uploaded dataset cannot be read."""


class DatasetValidationError(Exception):
    """Raised when the dataset fails structural validation."""

class DatasetTooLargeError(Exception):
    """Raised when the uploaded dataset exceeds the maximum allowed size."""
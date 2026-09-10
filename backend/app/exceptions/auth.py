class AuthenticationError(Exception):
    """Raised when authentication fails."""
    pass


class TokenInvalidError(Exception):
    """Raised when JWT token is invalid or expired."""
    pass


class UserNotFoundError(Exception):
    """Raised when a user is not found in the database."""
    pass


class UserAlreadyExistsError(Exception):
    """Raised when attempting to create a user with an email that already exists."""
    pass

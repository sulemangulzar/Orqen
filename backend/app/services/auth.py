from app.repositories import AuthRepository

class AuthService:
    def __init__(self, repository : AuthRepository) -> None:
        self.repository = repository

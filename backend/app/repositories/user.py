from app.api import SessionDep

class UserRepository:
    def __init__(self, session : SessionDep) -> None:
        self.session = session

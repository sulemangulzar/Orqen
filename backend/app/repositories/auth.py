from app.api import SessionDep

class AuthRepository:
    def __init__(self, session : SessionDep) -> None:
        self.session =  session

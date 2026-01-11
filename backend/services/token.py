import secrets

from auth.auth import hashpasswd
from db.entities import User
from exceptions.handle_exceptions import (
    exception_invalid_token,
    exception_user_not_found,
)
from sqlalchemy.orm import Session

from backend.services.email import SenderMail


def forgot_password(session: Session, username: str):
    user = session.query(User).filter(User.username).first()
    if not user:
        raise exception_user_not_found
    token = create_reset_token(user, session)
    sender_mail = SenderMail(username)
    sender_mail.send(username, f"Seu reset token é {token}", "Recuperação de senha")
    return token


def reset_password(user: User, password: str, reset_token: str, session: Session):
    if not user.token == reset_token:
        raise exception_invalid_token
    user.password = hashpasswd(password)
    session.commit()
    session.refresh(user)
    return user.password


def create_reset_token(user: User, session: Session):
    token = secrets.token_hex(12)
    user.token = token
    session.commit()
    session.refresh(user)
    return user.token

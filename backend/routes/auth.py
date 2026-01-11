import datetime

from auth.auth import checkpasswd, create_access_token
from db.connection import get_session
from db.entities import User
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from schemas.token import TokenSchema, UserLoginSchema
from schemas.user import UserForgotPasswordSchema, UserResetPasswordSchema
from services.token import forgot_password, reset_password
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenSchema)
async def login(
    user_schema: UserLoginSchema,
    session: Session = Depends(get_session),
):
    user = session.query(User).filter(User.username == user_schema.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado"
        )
    # checa se a senha do form_data bate com o hash do banco
    if not checkpasswd(user_schema.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Senha incorreta"
        )
    # cria um dicionario com as chaves sub e admin para gerar o JWT
    data = {"sub": user_schema.username, "admin": user.is_admin}
    access_token = create_access_token(data=data)
    refresh_token = create_access_token(
        data=data, expire_in_timedelta=datetime.timedelta(days=7)
    )
    token = TokenSchema(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )
    return token


@router.post("/token", response_model=TokenSchema)
async def login_for_access_token(
    # OAuth2PasswordRequestForm é um Schema que permite se autenticar no swegger pelo form e adicionar o token nos headers da sessão
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    user = session.query(User).filter(User.username == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado"
        )
    # checa se a senha do form_data bate com o hash do banco
    if not checkpasswd(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Senha incorreta"
        )
    # cria um dicionario com as chaves sub e admin para gerar o JWT
    data = {"sub": form_data.username, "admin": user.is_admin}
    access_token = create_access_token(data=data)
    refresh_token = create_access_token(
        data=data, expire_in_timedelta=datetime.timedelta(days=7)
    )
    token = TokenSchema(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )
    return token


@router.post("/forgot-password")
async def forgot(
    user: UserForgotPasswordSchema, session: Session = Depends(get_session)
):
    token = forgot_password(session, user.username)
    return {"status": status.HTTP_200_OK, "reset_token": token}


@router.put("/reset-password")
async def reset(user: UserResetPasswordSchema, session: Session = Depends(get_session)):
    password = reset_password(user.username, user.password, user.token, session)
    return {"status": status.HTTP_200_OK, "password": password}

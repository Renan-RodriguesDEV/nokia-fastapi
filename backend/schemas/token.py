from pydantic import BaseModel


class TokenSchema(BaseModel):
    access_token: str
    refresh_token:str
    token_type: str


class UserLoginSchema(BaseModel):
    username: str
    password: str

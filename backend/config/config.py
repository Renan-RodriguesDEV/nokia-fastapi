import os

from dotenv import load_dotenv

load_dotenv()

credentials = {
    "url": os.getenv("DB_URL"),
    "port": int(os.getenv("EMAIL_PORT", 587)),
    "host": os.getenv("EMAIL_HOST", "smtp.gmail.com"),
    "username": os.getenv("EMAIL_USERNAME"),
    "password": os.getenv("EMAIL_PASSWORD"),
    "DEBUG": True if os.getenv("DEBUG") == "TRUE" else False,
    "ALGORITHM": os.getenv("ALGORITHM", "HS256"),
    "SECRET_KEY": os.getenv("SECRET_KEY", "MY-SECRET-KEY"),
    "ACCESS_TOKEN_EXPIRE_TIME": os.getenv("ACCESS_TOKEN_EXPIRE_TIME", "4320"),
}

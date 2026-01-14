from config.config import credentials
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def get_engine():
    return create_engine(credentials.get("url"), echo=False)


def get_session():
    engine = get_engine()
    session = sessionmaker(bind=engine)()
    try:
        yield session
    except Exception as e:
        print(f"Error getting DB session: {e}")
        session.rollback()
        raise
    finally:
        session.close()

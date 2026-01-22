from config.config import credentials
from logger import logger
from sqlalchemy import QueuePool, create_engine
from sqlalchemy.orm import sessionmaker

# variaves globais para uso controlado de conexões com db
_engine = None
_SessionLocal = None


def get_engine():
    # cria engine se não existir, retorna a engine existente caso contrário
    global _engine
    if _engine is not None:
        return _engine
    _engine = create_engine(
        credentials.get("url"),
        echo=False,
        pool_size=3,
        max_overflow=2,
        pool_pre_ping=True,
        pool_recycle=1800,
        poolclass=QueuePool,
    )
    return _engine


def get_session():
    # cria sessão se não existir, retorna a sessão existente caso contrário
    global _SessionLocal
    if not _SessionLocal:
        _SessionLocal = sessionmaker(bind=get_engine())
    session = _SessionLocal()
    try:
        yield session
    except Exception as e:
        logger.error(f"Error getting DB session: {e}")
        session.rollback()
        raise e
    finally:
        session.close()

import logging


def setup_logger(name: str = "app", level: int = logging.DEBUG):
    logger = logging.getLogger(name)
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(
        logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    )
    logger.setLevel(level)
    logger.addHandler(console_handler)
    return logger


logger = setup_logger()
logger.info("logger initialized")

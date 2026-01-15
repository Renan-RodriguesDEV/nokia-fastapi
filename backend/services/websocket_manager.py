from fastapi import WebSocket
from logger import logger


class WebSocketManager:
    def __init__(self):
        self.connections: list[WebSocket] = list()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.append(ws)
        logger.debug("Usuário conectado")
        return True

    def disconnect(self, ws: WebSocket):
        self.connections.remove(ws)
        logger.debug("Usuário desconectado")
        return True

    async def send_text(self, ws: WebSocket, message: str):
        await ws.send_text(message)
        logger.debug(f"Enviando mensagem para 1 usuario, mensagem: {message}")

    async def broadcast(self, message: str):
        logger.debug(
            f"Enviando mensagem para {len(self.connections)} usuarios, mensagem: {message}"
        )
        for ws in self.connections:
            await ws.send_text(message)
        return len(self.connections)


manager = WebSocketManager()

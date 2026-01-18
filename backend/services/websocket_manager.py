from fastapi import WebSocket
from logger import logger


class WebSocketManager:
    def __init__(self):
        self.connections: set[WebSocket] = set()
        self.was_notify: dict[WebSocket, list] = dict()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.add(ws)
        self.was_notify[ws] = []
        logger.debug("Usuário conectado")
        return True

    def disconnect(self, ws: WebSocket):
        self.connections.remove(ws)
        logger.debug("Usuário desconectado")
        self.was_notify.pop(ws, None)
        return True

    async def send_text(self, ws: WebSocket, message: str):
        await ws.send_text(message)
        logger.debug(f"Enviando mensagem para 1 usuario, mensagem: {message}")

    async def broadcast(self, message: str):
        logger.debug(
            f"Enviando mensagem para {len(self.connections)} usuarios, mensagem: {message}"
        )
        for ws in self.connections:
            if message not in self.was_notify.get(ws, []):
                await ws.send_text(message)
                self.was_notify[ws].append(message)
        return len(self.connections)


manager = WebSocketManager()

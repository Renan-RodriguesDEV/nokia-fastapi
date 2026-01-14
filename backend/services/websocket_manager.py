from fastapi import WebSocket


class WebSocketManager:
    def __init__(self):
        self.connections: list[WebSocket] = list()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.append(ws)
        print("Usuário conectado")
        return True

    def disconnect(self, ws: WebSocket):
        self.connections.remove(ws)
        print("Usuário desconectado")
        return True

    async def send_text(self, ws: WebSocket, message: str):
        await ws.send_text(message)
        print(f"Enviando mensagem para 1 usuario, mensagem: {message}")

    async def broadcast(self, message: str):
        print(
            f"Enviando mensagem para {len(self.connections)} usuarios, mensagem: {message}"
        )
        for ws in self.connections:
            await ws.send_text(message)
        return len(self.connections)


manager = WebSocketManager()

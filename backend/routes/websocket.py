import datetime

from db.connection import get_session
from db.entities import Product
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from schemas.product import ProductPublicSchema
from services.websocket_manager import manager
from sqlalchemy.orm import Session

router = APIRouter(prefix="/ws", tags=["websockets"])


@router.websocket("/stock")
async def websocket_notify(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@router.get("/check/stock", response_model=list[ProductPublicSchema])
def check_stock(session: Session = Depends(get_session)):
    products = session.query(Product).filter(Product.stock < 10).all()
    [
        manager.broadcast(
            f"Produto {p.name} está com estoque abaixo de 10! total em estoque é de {p.stock}"
        )
        for p in products
    ]
    return products


@router.get("/check/validity", response_model=list[ProductPublicSchema])
def check_validity(session: Session = Depends(get_session)):
    current_date = datetime.datetime.now()
    products = session.query(Product).filter(Product.validity > current_date).all()
    [
        manager.broadcast(
            f"Produto {p.name} está com prazo de validade vencido! a data de vencimento era {p.validity}"
        )
        for p in products
    ]
    return products

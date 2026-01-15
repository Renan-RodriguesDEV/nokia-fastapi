from pydantic import BaseModel


class PaymentSchema(BaseModel):
    title: str
    quantity: int
    unit_price: float

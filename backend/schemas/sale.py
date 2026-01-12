import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from schemas.product import ProductSimpleSchema
from schemas.user import UserSimpleSchema


class SalePublicSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    product_id: int
    count: int
    value: float
    was_paid: bool
    user: UserSimpleSchema
    product: ProductSimpleSchema
    created_at: datetime.datetime


class SaleCreateSchema(BaseModel):
    user_id: int
    product_id: int
    count: int
    was_paid: bool = False


class SaleUpdateSchema(BaseModel):
    count: int
    was_paid: bool = False


class SaleUpdatePartialSchema(BaseModel):
    count: Optional[int] = None
    value: Optional[float] = None
    was_paid: Optional[bool] = None

import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from schemas.product import ProductSimpleSchema
from schemas.user import UserSimpleSchema


class CartPublicSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    product_id: int
    count: int
    user: UserSimpleSchema
    product: ProductSimpleSchema
    was_purchased: bool
    created_at: datetime.datetime


class CartCreateSchema(BaseModel):
    user_id: int
    product_id: int
    count: int
    was_purchased: Optional[bool] = None


class CartUpdateSchema(BaseModel):
    count: int
    was_purchased: bool


class CartUpdatePartialSchema(BaseModel):
    count: Optional[int] = None
    was_purchased: Optional[bool] = None

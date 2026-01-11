from typing import Optional

from pydantic import BaseModel, ConfigDict


class CartPublicSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    product_id: int
    count: int
    was_purchased: bool
    created_at: bool


class CartCreateSchema(BaseModel):
    user_id: int
    product_id: int
    count: int
    was_purchased: bool


class CartUpdateSchema(BaseModel):
    count: int
    was_purchased: bool


class CartUpdatePartialSchema(BaseModel):
    count: Optional[int] = None
    was_purchased: Optional[bool] = None

import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

Category = Literal[
    "Maquiagem",
    "Skincare",
    "Perfumes",
    "Hair Care",
    "Cosméticos",
    "Higiene Pessoal",
    "Acessórios de Beleza",
]


class ProductSimpleSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    price: float
    stock: int
    category: str
    validity: datetime.datetime


class ProductPublicSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    price: float
    stock: int
    category: str
    validity: datetime.datetime


class ProductCreateSchema(BaseModel):
    name: str
    price: float
    stock: int
    category: Category
    validity: datetime.datetime


class ProductUpdateSchema(BaseModel):
    name: str
    price: float
    stock: int
    category: Category
    validity: datetime.datetime


class ProductUpdatePartialSchema(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[Category] = None
    validity: Optional[datetime.datetime] = None

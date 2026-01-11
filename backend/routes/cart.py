from auth.auth import get_current_user
from db.connection import get_session
from db.entities import ShoppingCart, User
from exceptions.handle_exceptions import (
    exception_access_dained_for_user,
    exception_cart_not_found,
    exception_missing_content,
)
from fastapi import APIRouter, Depends, status
from schemas.cart import (
    CartCreateSchema,
    CartPublicSchema,
    CartUpdatePartialSchema,
    CartUpdateSchema,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/cart", tags=["cart"])


@router.post(
    "/create", status_code=status.HTTP_201_CREATED, response_model=CartPublicSchema
)
async def create(
    cart: CartCreateSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != cart.user_id and not current_user.is_admin:
        raise exception_access_dained_for_user
    cart_db = ShoppingCart(**cart.model_dump())
    session.add(cart_db)
    session.commit()
    session.refresh(cart_db)
    return cart_db


@router.delete(
    "/delete/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    cart = session.query(ShoppingCart).filter(ShoppingCart.id == id).first()
    if not cart:
        raise exception_cart_not_found
    if current_user.id != cart.user_id and not current_user.is_admin:
        raise exception_access_dained_for_user
    session.delete(cart)
    session.commit()
    return {
        "status": status.HTTP_204_NO_CONTENT,
        "message": "Carrinho deletado com sucesso",
    }


@router.put(
    "/update/{id}", status_code=status.HTTP_200_OK, response_model=CartPublicSchema
)
async def update(
    id: int,
    cart: CartUpdateSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != cart.user_id and not current_user.is_admin:
        raise exception_access_dained_for_user
    cart_data = cart.model_dump()
    cart_db = session.query(ShoppingCart).filter(ShoppingCart.id == id).first()
    for key, value in cart_data.items():
        if not value and key != "was_purchased":
            raise exception_missing_content
        setattr(cart_db, key, value)
    session.commit()
    session.refresh()
    return cart_db


@router.patch(
    "/update_partial/{id}",
    status_code=status.HTTP_200_OK,
    response_model=CartPublicSchema,
)
async def update_partial(
    id: int,
    cart: CartUpdatePartialSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != cart.user_id and not current_user.is_admin:
        raise exception_access_dained_for_user
    cart_data = cart.model_dump(exclude_unset=True)
    cart_db = session.query(ShoppingCart).filter(ShoppingCart.id == id).first()
    for key, value in cart_data.items():
        setattr(cart_db, key, value)
    session.commit()
    session.refresh()
    return cart_db

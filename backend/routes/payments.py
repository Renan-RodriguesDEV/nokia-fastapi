from auth.auth import get_current_user
from db.connection import get_session
from db.entities import Sale, User
from exceptions.handle_exceptions import (
    exception_access_dained_for_user,
    exception_not_payment,
    exception_runnable,
    exception_sale_not_found,
)
from fastapi import APIRouter, Depends, Request, status
from schemas.payment import PaymentSchema
from services.payment_manager import PaymentManager
from sqlalchemy.orm import Session

router = APIRouter(prefix="/payments", tags=["payments"])
payment_manager = PaymentManager()


@router.post("/{sale_id}", status_code=status.HTTP_201_CREATED)
def create(
    sale_id: int,
    payment: PaymentSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    sale = session.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise exception_sale_not_found
    if sale.user_id != current_user.id and not current_user.is_admin:
        raise exception_access_dained_for_user
    try:
        payment_response = payment_manager.create_preference(
            payment.title,
            payment.quantity,
            payment.unit_price,
        )
    except Exception as e:
        raise exception_runnable(e)
    if not payment_response:
        raise exception_not_payment
    sale.payment_id = payment_response.get("id")
    session.commit()
    return {
        "status": status.HTTP_201_CREATED,
        "data": {
            "info": payment.model_dump(),
            "payment": payment_response,
        },
    }


@router.get("/check/{payment_id}", status_code=status.HTTP_200_OK)
def check(payment_id: str, session: Session = Depends(get_session)):
    # sale = session.query(Sale).filter(Sale.payment_id==payment_id).first()
    # if not sale:
    #     raise exception_sale_not_found
    payment_status = payment_manager.check(payment_id)
    return {
        "status": status.HTTP_200_OK,
        "data": {
            # "sale":sale,
            "payment_status": payment_status
        },
    }


@router.get("/success", status_code=status.HTTP_200_OK)
def success(request:Request):
    print(f"Pagamento aprovado {request.query_params}")
    return {"status": status.HTTP_200_OK, "message": "success"}


@router.get("/failure", status_code=status.HTTP_200_OK)
def failure(request:Request):
    print(f"Pagamento falhou {request.query_params}")
    return {"status": status.HTTP_200_OK, "message": "failure"}


@router.get("/pending", status_code=status.HTTP_200_OK)
def pending(request:Request):
    print(f"Pagamento pendente {request.query_params}")
    return {"status": status.HTTP_200_OK, "message": "pending"}

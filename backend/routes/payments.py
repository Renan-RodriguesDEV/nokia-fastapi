from exceptions.handle_exceptions import exception_not_payment, exception_runnable
from fastapi import APIRouter, status
from schemas.payment import PaymentResponseSchema, PaymentSchema
from services.payment_manager import PaymentManager

router = APIRouter(prefix="/payments", tags=["payments"])
payment_manager = PaymentManager()


@router.post(
    "/", response_model=PaymentResponseSchema, status_code=status.HTTP_201_CREATED
)
def create(payment: PaymentSchema):
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
    return {
        "status": status.HTTP_201_CREATED,
        "data": {
            "info": payment.model_dump(),
            "payment": payment_response,
        },
    }


@router.get("/success", status_code=status.HTTP_200_OK)
def success(**args):
    print(f"Pagamento aprovado {args}")
    return {"status": status.HTTP_200_OK, "message": "success"}


@router.get("/failure", status_code=status.HTTP_200_OK)
def failure(**args):
    print(f"Pagamento falhou {args}")
    return {"status": status.HTTP_200_OK, "message": "failure"}


@router.get("/pending", status_code=status.HTTP_200_OK)
def pending(**args):
    print(f"Pagamento pendente {args}")
    return {"status": status.HTTP_200_OK, "message": "pending"}

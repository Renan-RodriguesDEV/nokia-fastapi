from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from services.payment_manager import PaymentManager

router = APIRouter(prefix="/payments", tags=["payments"])
payment_manager = PaymentManager()


class PaymentSchema(BaseModel):
    title: str
    quantity: int
    unit_price: float


@router.post("/", status_code=status.HTTP_201_CREATED)
def create(payment: PaymentSchema):
    payment_response = payment_manager.create_preference(
        payment.title,
        payment.quantity,
        payment.unit_price,
    )
    return {
        "status": status.HTTP_201_CREATED,
        "message": payment.model_dump(),
        "payment": payment_response,
    }


@router.get("/success", status_code=status.HTTP_200_OK)
def success(**args):
    print(f"Pagamento aprovado {args}")


@router.get("/failure", status_code=status.HTTP_200_OK)
def failure(**args):
    print(f"Pagamento falhou {args}")


@router.get("/pending", status_code=status.HTTP_200_OK)
def pending(**args):
    print(f"Pagamento pendente {args}")

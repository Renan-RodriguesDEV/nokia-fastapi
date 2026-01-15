import os

from dotenv import load_dotenv
from exceptions.handle_exceptions import exception_payment_error
from mercadopago import SDK

load_dotenv()


class PaymentManager:
    def __init__(self, access_token: str = os.getenv("MP_ACCESS_TOKEN")):
        self.sdk = SDK(access_token=access_token)

    def create_preference(
        self,
        title: str,
        quantity: int,
        unit_price: float,
        url: str = os.getenv("BACKEND_URL"),
    ):
        # Cria um item na preferência
        preference_data = {
            "items": [
                {
                    "title": title,
                    "quantity": quantity,
                    "unit_price": unit_price,
                }
            ],
            "back_urls": {
                "success": f"{url}/payments/success",
                "failure": f"{url}/payments/failure",
                "pending": f"{url}/payments/pendings",
            },
            "auto_return": "approved",
        }
        preference_response: dict = dict()
        try:
            preference_response: dict = self.sdk.preference().create(preference_data)
        except Exception as e:
            raise exception_payment_error(e)
        return preference_response.get("response")

    def check(self, payment_id: str):
        payment_response: dict = dict()
        try:
            payment_response: dict = self.sdk.payment().get(payment_id)
        except Exception as e:
            raise Exception(f"Erro ao consultar pagamento: {e}")
        return payment_response.get("response")

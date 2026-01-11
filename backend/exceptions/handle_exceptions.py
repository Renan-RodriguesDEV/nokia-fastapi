from fastapi import HTTPException, status

exception_access_dained = HTTPException(
    status.HTTP_401_UNAUTHORIZED, "Acesso não autorizado para usuários comuns"
)
exception_access_dained_for_user = HTTPException(
    status.HTTP_403_FORBIDDEN, "Acesso negado para seu usuário"
)
exception_user_not_found = HTTPException(
    status.HTTP_404_NOT_FOUND, "Usuário não encontrado"
)
exception_product_not_found = HTTPException(
    status.HTTP_404_NOT_FOUND, "Produto não encontrado"
)
exception_cart_not_found = HTTPException(
    status.HTTP_404_NOT_FOUND, "Carrinho não encontrado"
)
exception_sale_not_found = HTTPException(
    status.HTTP_404_NOT_FOUND, "Venda não encontrado"
)
exception_missing_content = HTTPException(
    status.HTTP_422_UNPROCESSABLE_ENTITY, "Faltou conteudo para sua requisição"
)
exception_invalid_token = HTTPException(
    status.HTTP_401_UNAUTHORIZED, "Seu token está invalido"
)

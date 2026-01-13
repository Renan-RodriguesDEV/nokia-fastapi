# especificando a imagem base
FROM python:3.12-slim

# definindo o diretório de trabalho
WORKDIR /app

# copiando os arquivos do projeto para o contêiner
COPY requirements.txt .
COPY . .

# Instalar as dependências do projeto ou build se necessário
RUN pip install --no-cache-dir -r requirements.txt

# expondo a porta que a aplicação irá rodar
EXPOSE 8000

# variáveis de ambiente
ENV DB_URL=${DB_URL}\
    DEBUG=FALSE\
    EMAIL_HOST=${EMAIL_HOST}\
    EMAIL_PORT=${EMAIL_PORT}\
    EMAIL_PASSWORD=${EMAIL_PASSWORD}\
    EMAIL_USERNAME=${EMAIL_USERNAME}

# comando para rodar a aplicação
CMD [ "python", "app.py" ]
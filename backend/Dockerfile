# especificando a imagem base
FROM python:3.12-slim

# definindo o diretório de trabalho
WORKDIR /app

# copiando os arquivos do requirements para o contêiner
COPY requirements.txt .

# Instalar as dependências do projeto ou build se necessário
RUN pip install --no-cache-dir -r requirements.txt

# copiando os arquivos do projeto para o contêiner
COPY . .

# Documenta em que porta a aplicação irá rodar
EXPOSE 8000

# variáveis de ambiente
ENV DEBUG=FALSE

# comando para rodar a aplicação
CMD [ "python", "app.py" ]
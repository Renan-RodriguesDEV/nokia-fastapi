FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm i && npm run build

EXPOSE 5000

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

CMD [ "npm","run","dev" ]
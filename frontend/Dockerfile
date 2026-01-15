FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm run build

COPY . .

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

CMD [ "npm","start" ]
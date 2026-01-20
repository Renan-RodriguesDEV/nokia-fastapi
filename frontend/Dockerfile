# Imagem base para build (compila o Next)
FROM node:20-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia manifestos primeiro para aproveitar cache de dependências
COPY package*.json ./

# Instala dependências (reprodutível com package-lock) e só então copia o código
RUN npm ci

# Agora sim copia o restante do código (app/, src/, public/, etc.)
COPY . .

# Gera build de produção do Next
RUN npm run build


# Imagem final (runtime) menor: só roda o app já buildado
FROM node:20-alpine AS runner

WORKDIR /app

# Variáveis de runtime (OBS: NEXT_PUBLIC_* geralmente é build-time no Next)
ENV NODE_ENV=production

# Copia apenas o necessário do estágio builder
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Se você usa next.config.* ou outros artefatos em runtime, pode precisar copiar também
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# Sobe o Next em modo produção
CMD ["npm", "start"]